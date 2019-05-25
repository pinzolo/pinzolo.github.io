---
layout: post
title: go-bindata が awesome-go から削除された
date: '2017-11-13T19:17:20+0900'
tags:
  - golang
---

[Goでファイル系のリソースも一緒にビルドして配布しちゃう\! \- hatappiのブログ](http://hatappi.hateblo.jp/entry/2017/11/11/155336)

こういうエントリがはてブに上がってた。

[Remove go\-bindata by wjkohnen · Pull Request \#1675 · avelino/awesome\-go](https://github.com/avelino/awesome-go/pull/1675)  
[Remove go\-bindata \(\#1675\) · avelino/awesome\-go@6cf3360](https://github.com/avelino/awesome-go/commit/6cf33601fc651b4cdd68045d5b6e0a961145953a)    
つい先日 go-bindata はメンテナンスされていないという理由で [Awesome Go](https://awesome-go.com/) から削除されたので、今後は使わない方がよいと思う。

じゃあ、何を使えばいいかというと自分の場合は [jessevdk/go\-assets: Simple embedding of assets in go](https://github.com/jessevdk/go-assets) を使用している。
[jessevdk/go\-assets\-builder: Simple assets builder program for go\-assets](https://github.com/jessevdk/go-assets-builder) を使って go ソースを生成し、`Assets.Open` 経由で取得できる。ファイルシステムとしてのインターフェースを持っているので `Read` や `Name` などが直接使えるので便利。

```sh
$ go-assets-builder assets > assets.go
```

```go
f, err := Assets.Open("/assets/template.tmpl")
if err != nil {
  return err
}
defer f.Close()
fmt.Println(f.Name())
```

みたいな感じで使う。
