---
layout: post
title: golang にて文字列のn番目の文字を取得する
date: '2016-05-31T13:17:00.000+09:00'
author: pinzolo
main-class: dev
tags:
- golang
---

文字列 s に対して、s[0] は最初のバイトを返すので、一旦 rune スライスを作成しないと n 番目の文字は取得できない。

```go
package main

import (
    "fmt"
)

func main() {
    s := "日本語"
    fmt.Println(string(s[0])) // => æ
    fmt.Println(string(getRuneAt(s, 0))) // => 日
}

func getRuneAt(s string, i int) rune {
    rs := []rune(s)
    return rs[i]
}
```
