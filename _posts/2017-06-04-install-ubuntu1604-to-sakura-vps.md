---
layout: post
title: さくらのVPSを Ubuntu 16.04 にリニューアル
date: '2017-06-04T14:56:55+0900'
main-class: vps
tags:
  - ubuntu
  - ssh
---

さくらのVPSのOSをいったんリセットした。新しく Ubuntu 16.04 をインストールしたのでそのメモ。

## Install Ubuntu 16.04

### Choose language

`Asia` -> `Japan` を選択

### Configure the keyboard

`English (US)` -> `Engilish (US)` を選択

### Configure the network

割り当てられた固定IP、ゲートウェイ、ネットマスクを入力

### Set up users and passwords

通常使用するユーザーのフルネーム、ユーザー、パスワードを設定
ホームディレクトリの暗号化は行わない

### Partition disks

1. Unmount partitions that are in user? -> Yes 選択
1. Guided partitioning -> use entire disk を選択
1. Virtual disk 1 (vda) を選択
1. Finish partitioning and write changes to disk
1. 既存のデータとパーティションが消えるよ？ -> yes

## SSH

### 公開鍵をコピー

```bash
$ scp .ssh/id_rsa.pub user@host:~/
```

### .ssh の設定

```bash
$ ssh user@host
% mkdir .ssh
% cat id_rsa.pub >> .ssh/authorized_keys
% chmod 600 .ssh/authorized_keys
% chmod 700 .ssh
% exit
```

### 秘密鍵でログインできるか確認

```bash
$ ssh host
```

### rootログインとパスワードでの認証を禁止する

```bash
% sudo vi /etc/ssh/sshd_config
```

#### root ログイン禁止

```diff
-PermitRootLogin without-password
+PermitRootLogin no
```

#### パスワード認証禁止

```diff
-#PasswordAuthentication yes
+PasswordAuthentication no
```

#### ssh の再起動

```bash
% sudo service ssh restart
```

#### 確認

```bash
$ ssh root@host
permission denied (publickey). # ログイン不可
```

### 使用するポートを変更する

#### sshd_config を変更する

```bash
% sudo vi /etc/ssh/sshd_config
```

```diff
-Port 22
+Port 22222
```

#### services の設定も変更する

```bash
% sudo vi /etc/services
```

```diff
-ssh             22/tcp                               # SSH Remote Login Protocol
-ssh             22/udp
+ssh             22222/tcp                               # SSH Remote Login Protocol
+ssh             22222/udp
```

#### 確認

```bash
$ ssh host
#=> エラーとなる

$ ssh host -p 22222
#=> ログインできる
```

## ホスト名を変更

以前のホスト名設定のままになっていたので、修正する

```bash
% sudo vi /etc/hostname
```

ファイル内容を新しいホスト名に変更

```bash
% sudo vi /etc/hosts
```

古いホスト名を新しいホスト名に変更

新しいホスト名はピリオドを含むのでプロンプトにフルホスト名を表示するように変更

```bash
% sudo vi .bashrc
```

```diff
-PS1='${debian_chroot:+($debian_chroot)}\u@\h:\w\$ '
+PS1='${debian_chroot:+($debian_chroot)}\u@\H:\w\$ '
```

とりあえず今日はここまで。
