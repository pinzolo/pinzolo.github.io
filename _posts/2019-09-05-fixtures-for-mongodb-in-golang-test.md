---
layout: post
title: Golang で MongoDB に fixture したい
date: '2019-09-05T14:44:57+0900'
tags:
  - golang
  - mongodb
---

## 最初に

[pinzolo/mongotest: Testing helper for using MongoDB\.](https://github.com/pinzolo/mongotest) という Go で MongoDB 使ってテストする際に fixture 投入できるツールを作った。

## 動機

テスト時には極力モックではなく実DBを使いたい。DB自体はだいたい Docker で事足りるけどテスト時のデータ投入にまあ fixtures ぐらいは使いたいよねとなる。

PostgreSQL や MySQL ならば [go\-testfixtures/testfixtures: Rails\-like test fixtures for Go\. Write tests against a real database](https://github.com/go-testfixtures/testfixtures) でいいんだけど最近使用している MongoDB だとメジャーなのはなさそう。

[OwlyCode/mongofixtures: A Go quick and dirty utility for cleaning collections and loading fixtures into them\.](https://github.com/OwlyCode/mongofixtures) というのを見つけたが6年前と大分古い。

[timvaillancourt/go\-mongodb\-fixtures: BSON fixtures of common MongoDB server commands](https://github.com/timvaillancourt/go-mongodb-fixtures) というのもあるけど、多分用途が違う。

あと、これは仕方ないんだけどどちらも mgo を使用していて公式ドライバじゃない。今後は公式ドライバが主流になると思っているので作っておこうと思った。

## 使い方

README.md の Example そのまんまだけど

```go
package main

import (
	"fmt"

	"github.com/pinzolo/mongotest"
)

func main() {
	mongotest.Configure(mongotest.Config{
		URL:            "mongodb://root:password@127.0.0.1:27017",
		Database:       "mongotest",
		FixtureRootDir: "testdata",
		FixtureFormat:  mongotest.FixtureFormatJSON,
		PreInsertFuncs: []mongotest.PreInsertFunc{
			mongotest.SimpleConvertTime("users", "created_at"),
		},
	})

	err := mongotest.UseFixture("json/admin_users", "json/foo_users")
	if err != nil {
		panic(err)
	}

	n, err := mongotest.Count("users")
	if err != nil {
		panic(err)
	}
	fmt.Println(n)
}
```

こんな感じ。ファイルの内容を読み込んでコレクションを drop してインサートする。データファイルを複数指定すれば中身をマージする。後に指定した方が優先される。データのフォーマットは YAML と JSON に対応。拡張子からどちらか自動的に判別してくれるモードもある。

`Count` とか `Find` みたいなテスト時によくやる定型処理を簡単にできるような関数も定義した。

ヘルスチェック的に使える `Try` 関数も用意していて下記のように使って、docker-compose し忘れで大量のエラーが出るのを抑制したりよくやる。

```go
package main_test

import (
	"fmt"
	"os"
	"testing"

	"github.com/pinzolo/mongotest"
)

func TestMain(m *testing.M) {
	mongotest.Configure(mongotest.Config{
		// 省略
	})

	if err := mongotest.Try(); err != nil {
		fmt.Println("Cannot connect to Database, please run `docker-compose up -d`")
		os.Exit(2)
	}
	code := m.Run()
	os.Exit(code)
}
```

## 困ったこととか

* 日時型という概念がない JSON は仕方ないが YAML でも `map[string]interface{}` に Unmarshal すると string にされるとは思わなかった。`!!timestamp` とか付けても無視されるし。日時型を登録できないのはさすがにまずいので苦肉の策で `PreInsertFuncs` というものを設けて登録前にデータを加工してもらうことで対応することにした。
* Travis CI で `services: mongodb` としたがどうしても接続できなかった。ユーザーを作成するスクリプトは成功しているので何が足りないのかわからない。仕方ないので開発時に使用しているTravis CI 内で docker-compose 動かして対応した。
* `yaml.Unmarshal` で用意していた JSON をすんなり読み込めてしまって驚いた。そういやフロースタイルとブロックスタイルなんてものがあったっけ。モード用意せずコードを簡潔にしようかと思ったけど他のフォーマットを追加しづらくなるのでやめておいた

## そんなわけで

今後使いながら拡張していく予定です。
