---
layout: post
title: JavaでPostgreSQLの?演算子を使用するために
date: '2016-02-25T11:08:00.001+09:00'
author: pinzolo
main-class: dev
tags:
- doma
- java
- jdbc
- postgresql
---

PostgreSQL には `?` という演算子があって、JSONB型に対して文字列の検索が行える。 

```sql
-- true を返す
SELECT '["a", "b", "c"]' ? 'a';

-- 管理者検索
SELECT *
FROM users
WHERE roles ? 'ADMIN';
```

といった使い方ができる。

ところが、例えば DOMA のようなフレームワークやバックエンドで JDBC を使っているツールなどではエラーとなる。

![](https://4.bp.blogspot.com/-LhSuaq3ufdk/Vs5hYj0FjyI/AAAAAAAAaCQ/eRQS1KXe0-k/s320/json-operator-error.png)

これを避けるためには `?` をエスケープしてやればよくて、

```sql
-- true を返す
SELECT '["a", "b", "c"]' ?? 'a';

-- 管理者検索
SELECT *
FROM users
WHERE roles ?? 'ADMIN';
```

としてやればよい。
