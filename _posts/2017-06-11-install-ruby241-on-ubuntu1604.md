---
layout: post
title: Ubuntu16.04@さくらのVPSに Ruby 2.4.1 をインストール
date: '2017-06-11T16:43:46+0900'
tags:
  - ruby
  - ubuntu
---

## Ruby インストールに必要なもの＋α（git, node）をインストール

```bash
% sudo apt-get install git zlib1g-dev libssl-dev libreadline-dev libyaml-dev libxml2-dev libxslt-dev libyaml-dev libffi-dev nodejs
```

## rbenv

### git で rbenv と ruby-build を clone

```bash
% sudo git clone https://github.com/sstephenson/rbenv.git /usr/local/rbenv
% sudo git clone https://github.com/sstephenson/ruby-build.git /usr/local/rbenv/plugins/ruby-build
```

### /etc/profile に設定を追加

```bash
% sudo vi /etc/profile
```

```diff
+# rbenv
+export RBENV_ROOT="/usr/local/rbenv"
+export PATH="$RBENV_ROOT/bin:$PATH"
+eval "$(rbenv init -)"
```

### 再度ログイン

```
mkdir: cannot create directory ‘/usr/local/rbenv/shims’: Permission denied
mkdir: cannot create directory ‘/usr/local/rbenv/versions’: Permission denied
```

こんなエラーが出た。必要なディレクトリが作成できないようなので `sudo` で作っておく

```bash
% sudo mkdir /usr/local/rbenv/shims
% sudo mkdir /usr/local/rbenv/versions
```

### Ruby 2.4.1 をインストール

```bash
% sudo rbenv install 2.4.1
sudo: rbenv: command not found
```

コマンドがないと怒られる。/etc/profile を読み込まないと rbenv は利用できないので `sudo -i` で実行してやる

```bash
% sudo -i rbenv install 2.4.1
% sudo -i rbenv global 2.4.1
% ruby -v
ruby 2.4.1p111 (2017-03-22 revision 58053) [x86_64-linux]
```

### bundler をインストール

```bash
% sudo -i gem install bundler
```
