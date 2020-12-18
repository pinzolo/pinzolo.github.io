---
layout: post
title: challengeだけの世界
date: '2020-12-18T20:52:04+0900'
tags:
  - OAuth
---

これは [Digital Identity技術勉強会 \#iddance Advent Calendar 2020 \- Qiita](https://qiita.com/advent-calendar/2020/iddance) 18日目の記事です。

今年から OAuth とか OIDC とか FIDO とか本格的にやり始めた pinozlo です。好きな拡張はみんな大好き [PKCE](https://tools.ietf.org/html/rfc7636) です。

で、PKCE とか勉強すると「state とか nonce とどう違うの？同じランダム値でしょ？」とか「PKCE で CSRF 防げるなら state いらんやん」とか「nonce でも CSRF 防げるの？なおさら state いらんやん」みたいな道を通るようです。私もなりました。

そして現在策定中の [OAuth 2.1](https://tools.ietf.org/html/draft-ietf-oauth-v2-1-00) では PKCE は MUST になりそうな雰囲気です。やったね！！

## おさらい

まずは state, nonce, PKCE の役割をおさらいしてみましょう

### state

* CSRF を防げる
* PKCE よりも早い段階で検知可能

### nonce

* リプレイアタックを防げる
* CSRF も防げる
* セッションと紐付ければ認可コードインジェクションも防げる

### PKCE

* 認可コード横取り攻撃を防げる
* CSRF も防げる
* 認可コードインジェクションも防げる

## 本題

ここからが本題です。といっても妄想をだらだら書くだけです。PKCE, nonce, state について学んだ人間ならたぶん大体の人は一度は考えたことあるであろう妄想です。

認可リクエストに3つもランダム値なパラメータあるのややこしいですよね。なんとか減らせませんかね？

state と nonce は何か（URL や ID Token）に埋め込まれて比較されるというシンプルな存在です。ある程度のエントロピーが確保されていれば別の値で代用できそうです。

PKCE の code_challenge は code_challenge_method=S256 ならばハッシュなので code_verifier を算出するのは難しいでしょう。露出しても良さそうです。

というか個人的には code_challenge_method=plain はいらないと思っています。第二の ROPC は言い過ぎでも第二の Implict Grtant ぐらいには危険そうです。

そんなわけで code_challenge で nonce や state の代用をしたフローを考えてみましょう。もはや認可コードのためのものにとどまらないので verifier と challenge としましょう。

1. Client は十分なエントロピーの verfier を生成し、ハッシュを challenge としてセッションに紐付けておく
2. Client は challenge と challenge_method を認可リクエストのパラメータとして送信する
3. Server は認可コードを生成し、challenge と紐付けておく
4. Server は ID Token を発行するならば challenge の値を埋め込む
5. Server は認可レスポンスのリダイレクト URL に `challenge=値` のクエリパラメータを付与する
6. Client はクエリパラメータから challenge の値を取得して、セッションに保存されている challenge の値と比較する（CSRF対策）
7. Client は ID Token を取得してログイン処理をするときに challenge の値を取得し、比較して未ログインならば使用済みとして処理する（リプレイアタック対策）
8. Client は認可コードと verifier をトークンリクエストのパラメータとして送信する
9. Server は verifier を challenge_method でハッシュ計算し、値が認可コードに紐付いている challenge と一致するかどうかを検証する（認可コード横取り攻撃対策）
10. Server は ID Token を発行するならば認可コードに紐付いている challenge を ID Token に埋め込む
11. Client は ID Token に埋め込まれている challenge がセッションに保存されている challenge の値と比較する（認可コードインジェクション対策）

とまあ、見た目上はうまくいきそうです。リプレイアタック対策はログイン処理に使用されたときにセッションから削除するのが多いと思いますが、セッション内の challenge が頻繁に使用するのでどう削除するか？どのようにセッションに保持するか？あたりは工夫が必要そうです。（ハイブリッドフロートの兼ね合いでなんか不都合がありそうな気もしますが）

で、こんなことをして何の得があるのでしょう？ポイントは PKCE が MUST になりそうという点です。

つまり必須パラメータで OPTIONAL なパラメータの代用が出来るなら、 OPTIONAL なパラメータをドロップすることができて少しだけ仕様がスッキリします。

そして必須パラメータなので、常に攻撃に対するチェックがなされるのでトータルとしてのセキュリティの向上が見込めるのじゃないでしょうか？Server と Client が正しく実装されていたらですけど。

もちろん1つのパラメータの役割は1つにするというのが基本ですが、こんな妄想もクリスマスに舞う1粒の粉雪として消えていくのもいいのではないかな。自分で言っていて意味がわからないけど。
