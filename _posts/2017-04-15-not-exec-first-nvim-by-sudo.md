---
layout: post
title: "neovimを初めて起動するときはsudoを使用してはならない"
date: '2017-04-15T23:01:42+0900'
tags:
  - mac
  - neovim
---

新しくmacを購入した。これを機に vim から neovim に移行しようとして、vim の環境を移行しなかった。homebrew などで必要なものをインストールしていろいろ設定すると nvim コマンドがエラーをこんな吐くようになった。

```
E886: System error while opening ShaDa file /Users/pinzolo/.local/share/nvim/shada/main.shada for reading: permission denied
```

一応編集はできるが、閉じるときも同様のエラーを吐く。

permission denied ということでパーミッションを確認してみる。

```bash
$ ls -al ~/.local/share/nvim/
otal 0
drwxr-xr-x  4 root  staff  136  4 15 22:45 .
drwxr-xr-x  3 root  staff  102  4 15 22:44 ..
drwx------  3 root  staff  102  4 15 22:45 shada
drwxr-xr-x  2 root  staff   68  4 15 22:45 swap
```

うん、そりゃ読めるわけないよ。なんで `$HOME` の下で `root` オーナーになっているのか？？・・・・あっ！！一番最初に nvim で `/etc/hosts` の編集をするために `sudo` で起動したからだ！！

幸い `~/.local` 配下には `nvim` 関連以外のものは何もなかったので、削除して再度 `sudo` なしでnvim立ち上げたら問題なくなった。というわけで、初回にneovimを起動するときは必ず `sudo` なしで実行しましょう。
