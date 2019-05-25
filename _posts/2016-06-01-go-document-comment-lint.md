---
layout: post
title: comment on exported function GetXxx should be of thee form "GetXxx ..."
tags:
- golang
---

Go は大文字で始まる public な型・関数に対してその直前に書かれたコメントをドキュメントとして扱ってくれる。  
lintでドキュメント書くように勧めてくるのは意識高い感じでよい。  
ただ、面倒なことにその型なり関数なりの名前で始まるのを推奨しているらしく、そうじゃない場合タイトルのような警告を出してくる。

こんな感じ 

```go
package main

// 設定情報を格納する ← メッセージ出しやがる
type Config struct {}

// ConfigError は設定情報に不備があった場合のエラー情報を格納する ← 推奨しているらしい
type ConfigError struct {}

// Fooを返す ← メッセージ出しやがる
func GetFoo() string {
  return "Foo"
}

// GetBar は Bar を返す ← 推奨しているらしい
func GetBar() string {
  return "Bar"
}
```

英語で書く場合なら、GetFoo returns Foo みたいに書きやすいのだが、日本語でコメントを書く場合冗長なコメントになりがちな気がする。  
関数名も型名も真下にあるじゃないか！  
なんて言っても仕方ないし、エディタにマークつけ続けられるのも気持ち悪いのでせっせとおっしゃる通りにするのだ

