---
layout: post
title: git 2.0.0 → git 2.8.1
date: '2016-04-06T11:52:00.000+09:00'
author: pinzolo
main-class: vps
tags:
- ubuntu
- git
---

```
$ git --version
  git version 2.0.0
$ cd /opt/src
$ wget https://www.kernel.org/pub/software/scm/git/git-2.8.1.tar.gz
$ tar xf git-2.8.1.tar.gz
$ cd git-2.8.1
$ ./configure --prefix=/opt/git/git-2.8.1 --with-openssl --with-curl
$ make
$ make install
$ /opt/git/git-2.8.1/bin/git --version
  git version 2.8.1
$ ln -sfn /opt/git/git-2.8.1/bin/* /usr/bin
$ git --version
  git version 2.8.1
```

とくに問題なし、前回と同じ。
