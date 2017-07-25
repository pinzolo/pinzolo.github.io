---
layout: post
title: "Eclipse で JavaSE への参照が二つに増えた"
date: '2017-07-25T18:56:27+0900'
main-class: dev
tags:
  - eclipse
  - java
---

こんなエラーが出た。

```
Build path contains duplicate entry: 'org.eclipse.jdt.launching.JRE_CONTAINER/org.eclipse.jdt.internal.debug.ui.launcher.StandardVMType/JavaSE-1.8' for project 'SomeProj'
```

実際に `Properties -> Java Build Path -> Libraries` を確認すると `JRE System Library [Java SE 8 [1.8.0_121]]` が二つ存在していた。

clean しても再起動しても直らない。試しに片方削除したら JRE を参照できずコンパイルエラーの嵐。

両方とも削除して `Add Library... -> JRE System Library -> Workspace default JRE` を追加したら解決した。
