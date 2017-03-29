---
layout: post
title: "GoでBOM付きのUTF8なCSVを扱うには"
date: '2017-03-30T00:04:12+0900'
main-class: dev
tags:
  - csv
  - golang
---

こういう CSV があるとします。ただし、BOM付きのUTF-8。

```csv
"名前","個数"
"りんご",1
"みかん",2
```

これを `csv.Reader` で読み込んでやる。

```go
package main

func main() {
	f, err := os.Open("fruits.csv")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	r := csv.NewReader(f)
	for {
		rec, err := r.Read()
		if err != nil {
			log.Fatal(err)
		}
		// Do something.
	}
}
```

普通ならこれでいいんだけど、BOM付きのUTF8の場合 `line 1, column 1: bare " in non-quoted-field` というエラーになる。
とりあえず `r.LazyQuotes = true` とすればエラーは出ないのだが、最初の要素が `"名前"` とクオート付きになる。
というかクオート付くだけならまだしも、実は BOM が付いているので `rec[0] == "\""名前"\""` は `false` になる。

Golang の `csv` パッケージは UTF8 の BOM には対応していなくて、[対応するつもりもなさそうだ。](https://github.com/golang/go/issues/9588)

仕方ないので自分で対応する。
とりあえず、UTF8かつBOMがあれば読み飛ばせばよかろうなので、

```go
func newCsvReader(r io.Reader) *csv.Reader {
	br := bufio.NewReader(r)
	bs, err := br.Peek(l)
	if err != nil {
		return csv.NewReader(br)
	}
	if bs[0] == 0xEF && bs[1] == 0xBB && bs[2] == 0xBF {
		br.Discard(3)
		bom = true
	}
	return csv.NewReader(br)
}
```

こんな感じで動く。

逆にBOM付きで書き込みたいなら、予め BOM を出力してやればいいのだから

```go
func newCsvWriter(w io.Writer, bom bool) *csv.Writer {
	bw := bufio.NewWriter(w)
	if bom {
		bw.Write([]byte{0xEF, 0xBB, 0xBF})
	}
	return csv.NewWriter(bw)
}
```

こんな感じで動く。

とまあ、そんな経由で [pinzolo/csvutil: CSV Utility for Golang](https://github.com/pinzolo/csvutil) というのを作ったので、使うなりツッコミ入れるなり育てるなりよろしくお願いします。

`NewReaderWithEnc` と `NewWriterWithEnc` は たった一行のコードなんだから都度書けよ、大してタイピング数変わらねーだろと思われるかもしれませんが、SHIFT_JIS な CSV を読み込んだり出力する時、どっちが `Encoder` でどっちが `Decoder` かよく忘れてしまうんです。

しかしまぁ、UTF8のBOMで幸せになった話を聞いたことが無い。
