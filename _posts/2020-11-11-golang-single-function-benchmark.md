---
layout: post
title: Go で特定のベンチマーク関数だけ実行するには
date: '2020-11-11T19:45:19+0900'
tags:
  - golang
  - testing
---

ベンチマーク関数がたくさんあるけど、実行時間短縮のために特定のベンチマーク関数の結果だけ欲しいときありますね

```sh
go test -test.bench=BenchmarkXxx
```

これでできます。ですが、これだとテストも実行されるのでテストが時間かかるときは待たされます。

テストの実行が不要で純粋にベンチマークの結果だけが欲しいときは `run` オプションを使います。

```sh
go test -test.bench=BenchmarkXxx -run=^$
```

benchmem ももちろん取得できます。

```sh
go test -test.bench=BenchmarkXxx -run=^$ -benchmem
```

`run` オプションには正規表現が使用できるので、`^$` でテスト名がないテストを指定しており、そんなテストはないのでテストの実行が全てキャンセルできます。

関連する特定のテストも実行したいときはこんな風にすればいいでしょう

```sh
go test -test.bench=BenchmarkXxx -run=TestXxx -benchmem
```
