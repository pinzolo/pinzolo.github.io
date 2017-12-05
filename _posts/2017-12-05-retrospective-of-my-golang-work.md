---
layout: post
title: golang振り返り
date: '2017-12-05T21:12:53+0900'
main-class: dev
tags:
  - golang
---

これは [Go4 Advent Calendar 2017 \- Qiita](https://qiita.com/advent-calendar/2017/go4) 5日目の記事です。

プライベートで Go を書き始めてどうやら１年半以上たっているらしい。年末だしアドベントカレンダーということで自分のリポジトリとともに振り返ってみる。

## きっかけ

Go 言語にはなんかはやり始めてる感じだなーという興味を持ってたと思う。んで、ちょっとした自分が仕事で使うようなコマンドラインツールを作ろうとしたときについでだし試してみるかと触ってみたのが最初。  
内の会社は BYOD が認められているのでいざ他の人に配布することになったときに Windows, Mac, Linux 全部で動くというのは大きいと思った。  
あと、会社のだれも触ってないみたいなので Go 使えるヤツがひとりぐらいいた方が面白いだろうというのもあった

## [pinzolo/casee](https://github.com/pinzolo/casee)

最初に作ったライブラリ。文字列をsnake_case やら PascalCase やら camelCase の変換を行うライブラリ。  
コード生成系のコマンドラインツールを作る予定があったのでお試しがてら作ってみた。  
たしか vim-go を入れただけの環境で開発したと思う。おかげでコメントとか `golint` に怒られるスタイルになってる。

## [pinzolo/dbmodel](https://github.com/pinzolo/dbmodel), [pinzolo/tablarian](https://github.com/pinzolo/tablarian) 

`tablarian` はコマンドラインでDBに直接アクセスしテーブル定義をコンソールに表示するツール。（現在PostgreSQL専用）  
弊社にはブラウザベースでのテーブル定義管理ツールがあるが、いちいちブラウザからアクセスするのめんどくさいし実際のDBとの乖離があったりしてたので、なら直接DBから定義引いたほうが便利じゃないか？と思って作った。  
`dbmodel` はテーブルなどのメタデータのモデリングで、当時はまだ Go でコマンドラインツールを作成する際のパッケージ戦略を理解しておらず、リポジトリ分けたほうが再利用できていいやんとおもって分けた。正直失敗。  
そこらへんも含めて 2018 年には作り直していきたい。

## [pinzolo/ysok](https://github.com/pinzolo/ysok)

とあるコミュニティで Slack を利用していて、すぐに要領が一杯になるので自分のあげた画像を一括削除するためのツール。

## [pinzolo/csvutil](https://github.com/pinzolo/csvutil)

CSV に対して様々な操作を行うコマンドラインツール。  
とある案件で複数の CSV ファイルを扱うことがあったんだけど、特定の列は顧客情報を含むためダミーデータにしなければいけなかったり、もとのデータが大きいのでちゃんとCSVの論理行単位で件数削除したり、新規に行を追加・削除したりする必要があったので作った。  
調子に乗ってけっこういろいろな処理を実装したが、特定のサブコマンドではあるオプション指定が必須だったりするのが反省点。  

また、このとき得た知見でLTしたりもした。  
[そうだ Go、京都。 \- connpass](https://go-kyoto.connpass.com/event/55599/)  
[encoding/csv // Speaker Deck](https://speakerdeck.com/pinzolo/csv)

この頃から開発環境として Atom を使い始めた、保存すると自動的にテストが走って、カバレッジ結果もエディタに反映されるのでこれええやんって思った。

## [pinzolo/xdgdir](https://github.com/pinzolo/xdgdir)

XDG Based directory を扱うためのライブラリ。同様のものはいくつもあるがファイルが存在していないとエラーを吐くものや、各homeしか扱わず毎回アプリケーション名からアクセスしなければいけなかったり、パスが Windows に対応していなかったりとどうにもしっくり来るものがなかったので作った。  
以後の自作ツールでそこそこ活躍している。

## [pinzolo/tmpl](https://github.com/pinzolo/tmpl)

コマンドラインのパラメータを指定したテンプレートに適用して結果をはき出すツール。スニペットのようなもの。  
最近の案件では [Welcome to Doma — Doma 2\.0 ドキュメント](https://doma.readthedocs.io/ja/stable/) を使用していて、ドメインクラスをはき出すために使っていたりする。

```
package foo.value{{if .pkg}}.{{.pkg}}{{end}};

import org.seasar.doma.Domain;

import com.fasterxml.jackson.annotation.JsonCreator;

import foo.value.Value;

@Domain(valueType = {{.type}}.class, factoryMethod = "of")
public class {{.name}} extends Value<{{.type}}> {
  private {{.name}}(final {{.type}} value) {
    super(value);
  }

  @JsonCreator
  public static {{.name}} of(final {{.type}} value) {
    return new {{.name}}(value);
  }
}
```

というテンプレートを `~/.local/share/domain.tmpl` に配置して `tmpl domain pkg:bar type:String name:UserName` とすれば、下記のコードをはき出す。

```java
package foo.value.bar;

import org.seasar.doma.Domain;

import com.fasterxml.jackson.annotation.JsonCreator;

import foo.value.Value;

@Domain(valueType = String.class, factoryMethod = "of")
public class UserName extends Value<String> {
  private UserName(final String value) {
    super(value);
  }

  @JsonCreator
  public static UserName of(final String value) {
    return new UserName(value);
  }
}
```

スニペットでええやんと思われるかもしれないがエディタを選ばないという利点と、json モードがあって引数やパイプ経由で JSON を受け入れることができるのでAPIと連携したりとかできる。

## [pinzolo/spwd](https://github.com/pinzolo/spwd)

弊社にはまだまだ ssh や psql 時にパスワード入力を求められる環境が残っていて、無味乾燥なランダムパスワードを覚えられない自分のために最初はパスワードをクリップボードにコピーしてくれるツールを作っていた。  
もちろんそんなものは公開できないのでプライベートなリポジトリにおいていたんだけど、それでもソースコードにベタにパスワードが書いてあるのはあまりにもイケてないのでどうしたら良いものかと考えてはいた。  
んで、秘密鍵で暗号化すればいいんじゃないか？皆 ssh の秘密鍵は流出しないように細心の注意を払うだろうから、そこに乗っかればセキュアなパスワード管理ツールになるかもしれないと思って作った。

JavaScript や TypeScript を書く機会が圧倒的に増えたのと、自動テストやカバレッジ結果の行反映も設定すればできることがわかったので VSCode に乗り換えた。Atom はやっぱりちょっと重い。

[Moongiftに取り上げられてびっくりした。](http://www.moongift.jp/2017/11/spwd-%e3%83%95%e3%82%a1%e3%82%a4%e3%83%ab%e3%83%99%e3%83%bc%e3%82%b9%e3%81%ae%e3%82%bb%e3%82%ad%e3%83%a5%e3%82%a2%e3%81%aa%e3%83%91%e3%82%b9%e3%83%af%e3%83%bc%e3%83%89%e7%ae%a1%e7%90%86/)

## [pinzolo/flagday](https://github.com/pinzolo/flagday)

つい先日作ったもの。仕事で祝日をいろいろ調査したときに、せっかくなので復習がてら Go のライブラリとして作った。  
[najeira/jpholiday: A package for Japanese holidays with Go](https://github.com/najeira/jpholiday) というのがあるのは作った後に知った。

あえて比較した特徴をあげるとすると

* 一年分の祝日を一括取得できるので日数分処理を呼び出す必要はない
* 内部でキャッシュしている
* 祝日名だけでなく種別など祝日に関するメタデータも取得できる
* ただしその分、計算して祝日名だけ返す jpholiday よりもメモリをくう
* 祝日の定義を構造体として内部に保持しているので、長い if 文を読み解く必要が無い

という感じだろうか。まあ、用途に合わせて好きな方を利用すればよいと思う。

## 来年は

そろそろ Go で Web サービスを作ったりしてみたい、あと `tablarian` は作り直して育てていきたい。  

## というわけで

皆様もよい 2018 年 Go life をお過ごしください。
