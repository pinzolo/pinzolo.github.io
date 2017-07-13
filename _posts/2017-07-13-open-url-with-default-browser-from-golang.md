---
layout: post
title: "Goから特定のURLを規定のブラウザで開かせたい"
date: '2017-07-13T18:08:16+0900'
main-class: dev
tags:
  - golang
---

Goで特定のURLを規定のブラウザで開かせたかった。
macなら `open`、Linuxなら `xdg-open` を `exec.Command` に渡してやればよい。

んで、Windows ではコマンドプロンプトだと `start URL` で同じ挙動をするのだが、Goからだと動かなかった。

```go
package main

import "os/exec"

func main() {
  err := exec.Command("start", "https://www.google.co.jp").Start()
  if err != nil {
    panic(err)
  }
}
```

こんなコードを Windows で動かしてみると `panic: exec: "start": executable file not found in %PATH%` となる。`start` コマンドはコマンドプロンプト内蔵コマンドであり、start.exe なんてものは存在しないのでコマンドプロンプト経由じゃないと動かないようだ。

```go
exec.Command("rundll32.exe", "url.dll,FileProtocolHandler", "https://www.google.co.jp").Start()
```

とすれば動く。

```go
package main

import "os/exec"

func main() {
  config := LoadConfig()
  err := exec.Command(config.OpenCommand, "https://www.google.co.jp").Start()
  if err != nil {
    panic(err)
  }
}
```

実際のコードはこんな感じなので、引数が増えるのはめんどくさい。とはいえ仕方ないので

```go
package main

import "os/exec"

func main() {
  config := LoadConfig()
  cmd := config.OpenCommand[0]
  args := config.OpenCommand[1:]
  args = append(args, "https://www.google.co.jp")
  err := exec.Command(cmd, args...).Start()
  if err != nil {
    panic(err)
  }
}
```

こんな感じにした。特定のオプションを指定したい人もいるだろうから汎用的になっていい感じかもしれない。
