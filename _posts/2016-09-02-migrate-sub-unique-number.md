---
layout: post
title: とある列に属する連番列を追加する場合
date: '2016-09-02T18:22:18+0900'
tags:
  - postgresql
---

PostgreSQL で下のようなテーブルがあったとする。

```sql
CREATE TABLE event_entry (
    id SERIAL
  , event_id INTEGER NOT NULL
  , user_id INTEGER NOT NULL
)
```

ここに受付番号 `entry_number` 列を追加することを考える。
ただし、`entry_number` は `event_id` に対してユニークなので、全体で一意とはならない。


```sql
ALTER TABLE event_entry ADD COLUMN entry_number INTEGER;

UPDATE event_entry main
SET entry_number = sub.entry_number
FROM (
  SELECT id
       , row_number() OVER (partition by event_id ORDER BY event_id, id) AS entry_number
  FROM event_entry
) sub
WHERE main.event_entry_id = sub.id
;

ALTER TABLE event_entry ALTER COLUMN entry_number SET NOT NULL;
ALTER TABLE event_entry ADD CONSTRAINT event_entry_uniq2 UNIQUE (event_id, entry_number) ;
```

とまあ、WINDOW関数使うのが手っ取り早くて良い。

じゃあ、WINDOW関数が使えない古い PostgreSQL だったらどうするか？

```sql
CREATE TEMP TABLE tmp_event_entry (
    tmp_id SERIAL
  , event_entry_id INTEGER NOT NULL
);

ALTER TABLE event_entry ADD COLUMN entry_number INTEGER;
INSERT INTO tmp_event_entry (event_entry_id)
SELECT id
FROM event_entry
ORDER BY event_id, id
;

UPDATE event_entry main
SET entry_number = tmp.id
FROM tmp_event_entry tmp
WHERE main.id = tmp.event_entry_id
;

UPDATE event_entry main
SET entry_number = entry_number - sub.base_number + 1
FROM (
  SELECT event_id
      , MIN(entry_number) AS base_number
  FROM event_entry
  GROUP BY event_id
) sub
WHERE main.event_id = sub.event_id
;

ALTER TABLE event_entry ALTER COLUMN entry_number SET NOT NULL;
ALTER TABLE event_entry ADD CONSTRAINT event_entry_uniq2 UNIQUE (event_id, entry_number) ;

DROP TABLE IF EXISTS tmp_event_entry;
```

こんな風にやるしかないのかな？

