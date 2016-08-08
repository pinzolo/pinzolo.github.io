---
layout: post
title: "serialのシーケンスがなが～い名前になる場合"
main-class: dev
tags: postgresql
---

PostgreSQLの `serial` はシーケンスを生成するわけだけども、シーケンスの名前は `table_name_column_name_seq` という形で生成される。`users` テーブルの `id` ならば `users_id_seq`という感じで

しかし、シーケンス名は63文字までなので、なが～い名前のテーブルのなが～い名前の列を対象にした場合は63文字を超えてしまう場合も当然あって、そんな場合は切り詰められたものが名前になる。
例えば `long_long_name_table_abcd_efgh_ijkl_mnop_qrst_uvwx_yz` テーブルの `long_long_name_column_abcd_efgh_ijkl_mnop_qrst_uvwx_yz` を対象にした場合は `sample.long_long_name_table_abcd_efg_long_long_name_column_abcd_ef_seq` となる。

このシーケンス名を取得するには `pg_catalog.pg_get_serial_sequence` 関数を使えばいいのだが、まあごくたまにはDBにアクセスせずにこのシーケンス名を指定したい場合があって、その場合は内部ルールをトレースする必要がある。

おそらく内部仕様はこんな感じ

1. テーブル名と列名の長さが合わせて58文字以下ならそのまま作成
1. テーブル名と列名ともに30文字以上ならばどちらも29文字に切り詰めて作成
1. どちらかが29文字未満のばあい、短い方はそのまま使用し残りの分（58-短い方の文字数）を長い方から切り出して作成

jsで書くならこんな感じ。

```js
var MAX_SEQ_NAME_LENGTH = 63;
var PARTS_LENGTH_THRESHOLD = 29;

function getSerialSequence(tableName, columnName) {
  t = tableName;
  c = columnName;
  if (tableName.length + columnName.length + 5 > MAX_SEQ_NAME_LENGTH) {
    if (tableName.length > PARTS_LENGTH_THRESHOLD) {
      if (columnName.length > PARTS_LENGTH_THRESHOLD) {
        t = tableName.substring(0, PARTS_LENGTH_THRESHOLD);
        c = columnName.substring(0, PARTS_LENGTH_THRESHOLD);
      } else {
        t = tableName.substring(0, PARTS_LENGTH_THRESHOLD + (PARTS_LENGTH_THRESHOLD - columnName.length));
      }
    } else {
        c = columnName.substring(0, PARTS_LENGTH_THRESHOLD + (PARTS_LENGTH_THRESHOLD - tableName.length));
    }
  }
  return t + "_" + c + "_seq";
}
```

この辺の仕様を説明した公式ドキュメントが無いかなと探してみたけど見つからない。ソース読むしか無いのだろうか

ちなみにこの結果、既存のシーケンスと名前が被るとき（例えば長い名前で末尾がほんの少しだけ違うテーブルのid列をserialで作成しようとした場合）は素直にエラーになってくれるので、名前を付け直すか integer で作って、シーケンスを別途作成しましょう。

