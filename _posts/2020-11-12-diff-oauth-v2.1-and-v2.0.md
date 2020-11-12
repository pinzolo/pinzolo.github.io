---
layout: post
title: OAuth 2.1 と 2.0 で適当に diff をとってみた
date: '2020-11-12T23:51:51+0900'
tags:
  - auth
---

最近は OAuth, OpenID Connect, FIDO とすっかり AuthN, AuthZ をがっつり勉強しております。

んで、7月末に WG Draft が出た [The OAuth 2\.1 Authorization Framework](https://tools.ietf.org/html/draft-ietf-oauth-v2-1) があるわけですが、勉強がてら OAuth v2\.1 と OAuth v2\.0 の diff をとってみた。 [diff の内容はコチラ](https://gist.github.com/pinzolo/732c3fe3c0c1a0ae0fefc47bac40791d)

まあ、[Section 12.](https://tools.ietf.org/html/draft-ietf-oauth-v2-1-00#section-12) を読めば大体わかるんですがね。

基本的にこのドラフトは下記の文書を統合した物です。

* [RFC6749 - OAuth 2.0](https://tools.ietf.org/html/rfc6749)
* [RFC6750 - Bearer Token Usage](https://tools.ietf.org/html/rfc6750)
* [RFC7636 - Proof Key for Code Exchange ](https://tools.ietf.org/html/rfc7636)
* [RFC8252 - OAuth 2.0 for Native Apps](https://tools.ietf.org/html/rfc8252)
* [OAuth 2.0 for Browser-Based Apps](https://tools.ietf.org/html/draft-ietf-oauth-browser-based-apps-06)
* [OAuth Security Best Current Practice](https://tools.ietf.org/html/draft-ietf-oauth-security-topics-15)

主な変更点はこちら。ただ、足りてないと思う。クライアントタイプが3つになるとかかなりでかい変更なのに Section 12. では触れられてないし。

* Authorization Code Grant を PKCE で拡張した
* Implict Grant を廃止
* Resource Owner Password Credentials Grant を廃止
* URI のクエリストリングでの bearer トークンの削除
* リフレッシュトークンは sender-constrained もしくはワンタイムトークンとすべき

BCP バージョンが上がった 16 が出ているし、Browser-Based Apps にいたっては Fix したら持ってくるとか気の長いことを言っているのでまだまだ変わりそう。

あと、クライアントタイプが増えているのはやっぱり気になる。__confidential__ の定義が変わるのはほかのいろんなドキュメントに影響を与えるし、_認可サーバに身元が確認されたクライアント_ なんてしれっと書いてあるけど、これは __認可サーバはクライアントの身元を確認する__ という要件が増えているとも取れる。__public__ と __confidential__ の定義は変えずに身元が確認された confidential クライアントを __trusted__ とか __certified__ とかにするのじゃダメだったんだろうか？

Device Flow は取り込まれずに例としてあげられているだけ、app2app や CIBA なんかは OpenID Connect 由来だからか全く触れられていない

あくまでも統合したものなので、この文書を起点にドラスティックな変更が現れることはなさそうな気がする。いや、クライアントタイプな変更はかなりドラスティックな気もする

まあ、まだ 00 なので、今後に注目ですね
