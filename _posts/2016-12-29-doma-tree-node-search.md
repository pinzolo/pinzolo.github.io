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
  ON r.id = n.parent_id
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
    if (obj instanceof Iterable) {
      List<String> escapedValues = new ArrayList<>();
      Iterable<?> it = (Iterable<?>) obj;
      for (Object v : it) {
        escapedValues.add(toSqlValueExpr(v));
      }
      val = String.join(", ", escapedValues);
    } else {
      val = toSqlValueExpr(obj);
    }
    return "ARRAY[" + val + "]";
  }

  private String toSqlValueExpr(Object obj) throws SQLException {
    if (obj instanceof Number) {
      return obj.toString();
    }

    StringBuilder builder = new StringBuilder("'");
    // Utils は org.postgresql.core.Utils
    return Utils.escapeLiteral(builder, obj.toString(), false).append("'").toString();
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

追記：テストコードも置いておこう（Spock）

```groovy
package pinzolo.doma.postgresql

import spock.lang.Shared
import spock.lang.Specification

class PgExpressionFunctionsTest extends Specification {
  @Shared
  def funcs = new PgExpressionFunctions();

  def "数値の配列表現"() {
    expect:
    funcs.toArrayExpr(1) == "ARRAY[1]"
  }

  def "文字列の配列表現"() {
    expect:
    funcs.toArrayExpr("foo") == "ARRAY['foo']"
  }

  def "文字列の場合はエスケープされる"() {
    expect:
    funcs.toArrayExpr("foo'bar\\") == "ARRAY['foo''bar\\\\']"
  }

  def "コレクションは展開される"() {
    expect:
    funcs.toArrayExpr([1, 2, 3]) == "ARRAY[1, 2, 3]"
  }

  def "コレクションでもエスケープされる"() {
    expect:
    funcs.toArrayExpr(["foo'bar", "foo\\bar"]) == "ARRAY['foo''bar', 'foo\\\\bar']"
  }

  def "その他のオブジェクトは文字列化"() {
    expect:
    funcs.toArrayExpr(new StringBuilder("foo")) == "ARRAY['foo']"
  }

  def "その他のオブジェクトでもエスケープされる"() {
    expect:
    funcs.toArrayExpr(new StringBuilder("foo'bar\\")) == "ARRAY['foo''bar\\\\']"
  }
}
```
