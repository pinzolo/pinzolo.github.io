---
layout: post
title: 'お使いの起動ディスクは一杯です '
date: '2016-03-08T16:39:00.001+09:00'
author: pinzolo
tags:
- mac
---

作業中に「お使いの起動ディスクは一杯です」というダイアログが表示された。

```bash
# parallels のログ削除
$ sudo rm /Library/Logs/parallels.*

# homebrew の不要ファイル削除
$ brew cleanup

# キャッシュの削除
$ sudo rm -dfR /System/Library/Caches/* /Library/Caches/* ~/Library/Caches/*
```

この3つのコマンド走らせるだけで、30Gほど空きスペースを確保できた。  
ちょっと放置し過ぎか
