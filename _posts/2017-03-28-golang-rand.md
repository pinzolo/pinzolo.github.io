---
layout: post
title: "Goでrand使うときはseedを設定しましょう"
date: '2017-03-28T21:11:33+0900'
tags:
  - golang
---

Go でランダムデータ生成を書いていたら、何度やっても同じ結果になった。

```go
package main

import (
	"fmt"
	"math/rand"
)

func main() {
	for i := 0; i < 10; i++ {
		fmt.Println(rand.Int())
	}
}
```

こんなコードを実行すると、

```
5577006791947779410
8674665223082153551
6129484611666145821
4037200794235010051
3916589616287113937
6334824724549167320
605394647632969758
1443635317331776148
894385949183117216
2775422040480279449
```

毎回こうなる。これは `rand.Float32` や `rand.Intn` でも同様で、ようするに自分で `seed` を設定しない限り、固定の `seed` が設定されるようだ。

```go
package main

import (
	"fmt"
	"math/rand"
	"time"
)

func main() {
	rand.Seed(time.Now().UnixNano())
	for i := 0; i < 10; i++ {
		fmt.Println(rand.Int())
	}
}
```

とこんな感じで必ず最初に `rand.Seed` を設定しましょう。
