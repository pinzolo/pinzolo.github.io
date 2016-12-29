---
layout: post
title: "Domaで隣接リストなtreeの検索"
date: '2016-12-29T19:22:16+0900'
main-class: dev
tags:
  - java
  - postgresql
---

PostgreSQL のこんなビューに対して、特定のノード（id: 10）を子孫含めて取得したい。

```sql
CREATE TABLE node (
    id SERIAL NOT NULL
  , caption TEXT NOT NULL
  , parent_id INTEGER
);

CREATE VIEW tree AS
WITH RECURSIVE r AS (
  SELECT *
       , ARRAY[id] AS path
  FROM node
  WHERE parent_id IS NULL
  UNION ALL
  SELECT n.*
       , r.path || n.id AS path
  FROM node n
  INNER JOIN r
  ON r.id = c.parent_id
)
SELECT *
     , array_length(path, 1) AS depth
FROM r
;

```

こんな SQL になる。

```sql
SELECT *
FROM tree
WHERE path @> ARRAY[10]
```

これを Doma で実現したい。まずは単純にこんな SQL を書く。

```java
@Dao
@InjectConfig
public interface TreeDao {
  @Select
  List<Node> selectNodesWithDescendants(Integer rootNodeId);
}
```

```sql
SELECT /*%expand*/*
FROM tree
WHERE path @> ARRAY[/*rootNodeiId*/0]
```

しかし、これだと下記のSQLが実行されエラーとなる。要するに閉じ括弧が消されてしまう。

```sql
SELECT *
FROM tree
WHERE path @> ARRAY[10
```

これに対応するには、[埋め込み変数コメント](http://doma.readthedocs.io/ja/stable/sql/#id13) を使う。

```java
@Dao
@InjectConfig
public interface TreeDao {
  @Select
  List<Node> selectWithDescendants(String arrayExpr);

  default List<Node> selectWithDescendants(Integer rootNodeId) {
    return selectWithDescendants("ARRAY[" + rootNodeId + "]");
  }
}
```

```sql
SELECT /*%expand*/*
FROM tree
WHERE path @> /*# arrayExpr */
```

これでとりあえず処理自体は正常に動作するが、毎回これをやるのはめんどくさい。[カスタム関数](http://doma.readthedocs.io/ja/stable/expression/?highlight=%E9%96%A2%E6%95%B0#id12)として組み込んでしまおう。  
関数定義はちょっと汎用的にしてこんな感じ。

```java
public class PgExpressionFunctions extends StandardExpressionFunctions {
  public String toArrayExpr(Object obj) throws SQLException {
    String val = null;
    if (obj instanceof Number) {
      val = obj.toString();
    } else if (obj instanceof Iterable) {
      List<String> escapedValues = Lists.newArrayList();
      Iterable<?> it = (Iterable<?>) obj;
      for (Object v : it) {
        escapedValues.add(toSqlExpr(v));
      }
      val = Strings.join(escapedValues, ',');
    } else {
      val = toSqlExpr(obj.toString());
    }
    return "ARRAY[" + val + "]";
  }

  private String toSqlExpr(Object obj) throws SQLException {
    if (obj instanceof Number) {
      return obj.toString();
    }

    // Utils は org.postgresql.core.Utils
    return "'" + Utils.escapeLiteral(new StringBuilder(), obj.toString(), false).toString() + "'";
  }
}
```

DAO の interface は元に戻す。

```java
@Dao
@InjectConfig
public interface TreeDao {
  @Select
  List<Node> selectNodesWithDescendants(Integer rootNodeId);
}
```

SQLは埋め込み変数コメントとカスタム関数を組み合わせる。

```sql
SELECT /*%expand*/*
FROM tree
WHERE path @> /*# @toArrayExpr(rootNodeId) */
```

これで、やりたいことがシンプルにできるようになった。
