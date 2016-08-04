---
layout: post
title: Go でバージョン比較
description:
main-class: dev
tags: golang
---

`9.4` とか `0.10.1` みたいなバージョンを比較したい時がある。そんな時は [hashicorp/go\-version: A Go \(golang\) library for parsing and verifying versions and version constraints\.](https://github.com/hashicorp/go-version) を使う。

```go
package main

import (
    "fmt"
    "os"

    "github.com/hashicorp/go-version"
)

func main() {
    v1, err := version.NewVersion("9.3.1")
    if err != nil {
        fmt.Fprintln(os.Stderr, err)
        return
    }
    v2, err := version.NewVersion("9.10.5")
    if err != nil {
        fmt.Fprintln(os.Stderr, err)
        return
    }
    if v1.Compare(v2) >= 0 {
        // do something
    }
}
```

こんな感じで使える。
`LessThan`, `GreaterThan`, `Equal` などもある。
[Semantic Version](http://semver.org) に対応している必要があるようだ。
