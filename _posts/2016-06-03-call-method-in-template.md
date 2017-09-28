---
layout: post
title: golangのテンプレート内でメソッドを呼び出す
date: '2016-06-03T11:02:00.002+09:00'
main-class: dev
tags:
- golang
---

`text/template` のサンプルをいくつか見てみたところ、構造体を渡してフィールドを埋め込んで表示するサンプルばかりだった。じゃあメソッド呼べるの？と思ったので試してみた。

```go
package main

import (
    "os"
    "text/template"
)

type Person struct {
    Name string
    City string
}

func (p Person) GetAge() int {
  return 36
}

func main() {
    tmpl, err := template.New("test").Parse("{{.Name}}({{.GetAge()}}) lives in {{.City}}.")
    if err != nil {
        panic(err)
    }
    p := Person{"pinzolo", "Kyoto"}
    err = tmpl.Execute(os.Stdout, p)
    if err != nil {
        panic(err)
    }
}
```

```
panic: template: test:1: unexpected "(" in operand<br /><br />goroutine 1 [running]:
panic(0x13f660, 0xc82000a440)
/usr/local/Cellar/go/1.6.2/libexec/src/runtime/panic.go:481 +0x3e6
main.main()
/Users/pinzolo/.cache/junkfile/2016/06/2016-06-03-101728.go:20 +0x24b
exit status 2
```

できなかった。

括弧が unexpected なら、括弧なしならどうなの？？

```go
package main

import (
    "os"
    "text/template"
)

type Person struct {
    Name string
    City string
}

func (p Person) GetAge() int {
    return 36
}

func main() {
    tmpl, err := template.New("test").Parse("{{.Name}}({{.GetAge}}) lives in {{.City}}.")
    if err != nil {
        panic(err)
    }
    p := Person{"pinzolo", "Kyoto"}
    err = tmpl.Execute(os.Stdout, p)
    if err != nil {
        panic(err)
    }
}
```

```
pinzolo(36) lives in Kyoto.
```

出来た。正直言って予想外だった。

じゃあ、引数はどうやって渡すの？

```go
package main

import (
    "os"
    "text/template"
)

type Person struct {
    Name string
    City string
}

func (p Person) GetAge() int {
    return 36
}

func (p Person) GetFutureAge(yearAfter int) int {
    return p.GetAge() + yearAfter
}

func main() {
    tmpl, err := template.New("test").Parse("{{.Name}}({{.GetAge}}) lives in {{.City}}. 2 years later he is {{.GetFutureAge 2}}.")
    if err != nil {
        panic(err)
    }
    p := Person{"pinzolo", "Kyoto"}
    err = tmpl.Execute(os.Stdout, p)
    if err != nil {
        panic(err)
    }
}
```

`len`とかのビルトイン関使うようにスペース開ければいいかな？

```go
package main

import (
    "os"
    "text/template"
)

type Person struct {
    Name string
    City string
}

func (p Person) GetAge() int {
    return 36
}

func (p Person) GetFutureAge(yearAfter int) int {
    return p.GetAge() + yearAfter
}

func main() {
    tmpl, err := template.New("test").Parse("{{.Name}}({{.GetAge}}) lives in {{.City}}. 2 years later he is {{.GetFutureAge 2}}.")
    if err != nil {
        panic(err)
    }
    p := Person{"pinzolo", "Kyoto"}
    err = tmpl.Execute(os.Stdout, p)
    if err != nil {
        panic(err)
    }
}
```

```
pinzolo(36) lives in Kyoto. 2 years later he is 38.
```

出来た。

じゃあ2つ以上の引数はスペース区切りかな？

```go
package main

import (
    "os"
    "text/template"
)

type Person struct {
    Name string
    City string
}

func (p Person) GetAge() int {
    return 36
}

func (p Person) GetFutureAge(yearAfter int, other int) int {
    return p.GetAge() + yearAfter + other
}

func main() {
    tmpl, err := template.New("test").Parse("{{.Name}}({{.GetAge}}) lives in {{.City}}. 5 years later he is {{.GetFutureAge 2 3}}.")
    if err != nil {
        panic(err)
    }
    p := Person{"pinzolo", "Kyoto"}
    err = tmpl.Execute(os.Stdout, p)
    if err != nil {
        panic(err)
    }
}
```

```
pinzolo(36) lives in Kyoto. 5 years later he is 41.
```

やっぱり。

趣向を変えて、構造体のポインタを渡してもうまく動くかな？

```go
package main

import (
    "os"
    "text/template"
)

type Person struct {
    Name string
    City string
}

func (p *Person) GetAge() int {
    return 36
}

func (p *Person) GetFutureAge(yearAfter int) int {
    return p.GetAge() + yearAfter
}

func main() {
    tmpl, err := template.New("test").Parse("{{.Name}}({{.GetAge}}) lives in {{.City}}. 2 years later he is {{.GetFutureAge 2}}.")
    if err != nil {
        panic(err)
    }
    p := &Person{"pinzolo", "Kyoto"}
    err = tmpl.Execute(os.Stdout, p)
    if err != nil {
        panic(err)
    }
}
```

```go
package main

import (
    "os"
    "text/template"
)

type Person struct {
    Name string
    City string
}

func (p Person) GetAge() int {
    return 36
}

func (p Person) GetFutureAge(yearAfter int) int {
    return p.GetAge() + yearAfter
}

func main() {
    tmpl, err := template.New("test").Parse("{{.Name}}({{.GetAge}}) lives in {{.City}}. 2 years later he is {{.GetFutureAge 2}}.")
    if err != nil {
        panic(err)
    }
    p := &Person{"pinzolo", "Kyoto"}
    err = tmpl.Execute(os.Stdout, p)
    if err != nil {
        panic(err)
    }
}
```

```
pinzolo(36) lives in Kyoto. 2 years later he is 38.
```

問題ない。構造体に定義したメソッドもポインタに定義したメソッドも呼び出せてる。

結構色々出来るんだな `text/template`
