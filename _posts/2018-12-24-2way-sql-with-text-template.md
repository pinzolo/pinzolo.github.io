---
layout: post
title: "text/templateをベースにした 2way SQL ライブラリ"
date: '2018-12-24T01:07:16+0900'
tags:
  - golang
  - sql
---

## TL;DR

`text/template` の機能を使った 2way SQL のライブラリ [pinzolo/sqlt: Simple SQL template for 2 way SQL\.](https://github.com/pinzolo/sqlt) を作ったよ。

## 動機

クエリビルダのスタイルは様々あってどれがよいなどの議論は他に任せるとして、 個人的にはSQLはガンガン書きたい人です。  
RDBの能力をちゃんと引き出すにはSQLの知識は必須だし、まあなんかいろいろ思うところがあってSQLを直接書いた方がいろいろ効率的だと思ってる。  
そんなわけで業務ではJavaなので 2way SQL を採用している[Doma](https://doma.readthedocs.io/ja/stable/) というライブラリがお気に入り。

その 2way SQL を Go でも使いたいと思うが、自分が調べた範囲ではなかなか完成度の高い物が見つけられなかった。  
そんならとりあえず自分が使うに耐える物程度の物でいいので自作するかと思ったが scanner 書くのたりいなと思ってた。（それが正道なんだけど）

そんな中で出会ったのが `text/template` の `Template.Delims` だった。これは要するに、本来は {% raw %}`{{`{% endraw %} と {% raw %}`}}`{% endraw %}で囲まれたところが処理されるのだがその文字を変換できる仕組みである。  
これをSQLフレンドリーにすればお手軽に 2way SQL ライブラリを作れるのではないか？と思ったので作ってみた。

## How to use?

```sql
SELECT *
FROM users
WHERE id IN /*% in "ids" %*/(1, 2)
AND name = /*% p "name" %*/'John Doe'
/*%- if val "onlyMale" %*/
AND sex = 'MALE'
/*%- end %*/
ORDER BY /*% val "order" %*/id
```

こんなSQLテンプレートを書いて

```go
query, args, err := sqlt.New(sqlt.Postgres).Exec(s, map[string]interface{}{
	"ids":      []int{1, 2, 3},
	"order":    "name DESC",
	"onlyMale": false,
	"name":     "Alex",
})
rows, err := db.Query(sql, args...)
```

こんな感じで実行すれば

```sql
SELECT *
FROM users
WHERE id IN ($1, $2, $3)
AND name = $4
ORDER BY name DESC
```

こんなSQLが実行される。(PostgreSQL)

## `text/template` を使うメリット

* `if`, `for` といった制御構文を自作する必要が無い
* `eq`, `and` といった比較処理を自作する必要が無い（`==` や `&&` の方がいいという意見はある）
* custom func を登録できるので様々な SQL 向けの処理を差し込める
* Goを使う人なら構文を覚え直す必要が無い（ちなみに私はまだ慣れてない）

というように 2way SQL に必須な機能の一部はすでに `text/template` が提供してくれる。  
あと個人的に前後の空白削除の機能があるのは非常にうれしい。

## `text/template` を使うデメリット

* 自作 scanner パターンよりもパフォーマンスが出ない（はず）
* 自作 scanner パターンよりも柔軟度が低い

## sqltが解決すること

sqlt はまあだいたい以下のようなことを機能として持っています。

### パラメータに名前を付けられる

いろいろなドライバがあるが `sql.NamedArg` に対応しているのが少ない。  
SQLとロジックを二つ並べて順序からエラーのあるパラメータを探るとかしたくない。でかいSQLになると数え間違いによるロスも馬鹿にならない。  
Domaのように静的解析で解決するのも良いが、sqltではリーズナブルに `map[string]interface{}` で解決することにした。

### IN句での slice 展開

残念ながらほとんどのドライバでは `WHERE id IN $1` に対して slice を渡しても展開してくれない。  
`fmt.Sprintf` とか `strings.Join` で SQL を構築するとかしたくないし、そもそもSQLを外だしすることが 2way SQL のメリットの1つである。  
sqlt は `text/template` ベースなので custom func とリフレクションで解決できた。

### LIKE検索

`prefix`, `infix`, `suffix`, `escape` という関数を提供するので `'%' || ? || '%'` みたいなことをしなくてもいい。

### パラメータ役割問題

これは 2way SQL 独特の問題で、2way SQL において渡すパラメータには3種類ある。

* SQL 実行時に使用されるパラメータ
* SQL 構築時に使用されるパラメータ
* その両方に使われるパラメータ

である。例えばこんな 2way SQL があったとする。（Doma風）

```sql
SELECT * FROM users
/* if onlyAvailable */
WHERE status IN /* availableStatuses */(NULL)
/* end */
```

この場合、`onlyAvailable` が true ならば `availableStatuses` を渡す必要があるが、false の場合は必要ない。  
SQLだけを生成する 2way SQL ライブラリの場合、この判断をテンプレート内と、SQL実行時に行ってしまうと二度手間である。  
そこで sqlt では SQL の精製時にプレースホルダに置き換えたパラメータの slice を返却している。  
正直なところ、開発時初期にはこれをどうすればいいか悩んでいたのだけれど、`text/template` の custom func には純粋な関数だけでなくレシーバをもつメソッドを渡すこともでき（よく考えたら当然だ）レシーバに副作用として呼び出しを記録できることに気がついたら早かった。

## デリミタについて

sqlt は `/*%` と `%*/` で囲むスタイルなので Doma とは異なる。  
というのも本来 `text/template` はコメントを許容しており {% raw %}`{{/* This is comment */}}`{% endraw %} みたいなのが書ける。  
なので Doma の `/* ... */` も `/*% ... */` もコンフリクトすると思われるので `/*% ... %*/` とした。かなり妥協案。

## SQLインジェクション対策

基本的にはプレースホルダに変換しているので安心なのだが別の懸念がある。

```sql
SELECT *
FROM users
ORDER BY /* order */name
```

みたいな 2way SQL は許可したい。しかしこれは容易にSQLインジェクションを生み出してしまう。  
わかってるヤツだけが使えよってライブラリにしてもいいんだけど、超突っ込みポイントであるわけでちゃんとできるならちゃんとしたい。  
そこで少し記述の冗長性を許容することにした。sqlt では `Exec` 時に渡されたパラメータは直接テンプレートに渡さず、全て関数経由で取り出すスタイルとした。

```sql
SELECT *
FROM users
ORDER BY /*% val "order" %*/name
```

こんな感じで SQL に直接埋め込むには `val` 関数経由でやるようにした。  
`val` 関数は値にシングルコーテーション、セミコロン、コメント（`--`, `/*`, `*/`）が含まれている場合エラーとしている。  
これは[Domaの埋め込み変数コメント](https://doma.readthedocs.io/ja/stable/sql/#id13)を参考にしているがまだ調査不足なところがある。  
というのも Oracle での複文区切りは本来は `/` なのだが Doma では考慮されていない。これはおそらく JDBC がよしなにやっているからのような気がする。  
Go の `database/sql` は複数の結果セットに対応しているので要調査である。この方針にしたのが最近なので調査が間に合ってないという言い訳をしておく。

## sqltの今後

今後はがっつりではないけどちまちまのんびりと更新していくつもり。とりあえず `Exec` 時にオプションを受け取れるようにしたいので、正直なところ API は破壊的に変わる可能性があります。  

とはいえ production に耐えうる物にはしてきたいので、ご指導ご鞭撻の程よろしくお願いいたします。
