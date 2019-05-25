---
layout: post
title: "Sugar.js を Vue.js で使用する"
date: '2017-10-24T21:28:35+0900'
tags:
  - javascript
  - sugar.js
  - vue.js
---

諸事情があって Vue.js のアプリケーションで [Sugar \- A Javascript utility library for working with native objects\.](https://sugarjs.com/) を利用することにしたので導入のメモ。  
アプリケーションは vue-cli を使って作成したもの。

## インストール

```sh
$ npm install sugar --save
```

## ロード

main.js でロードし Extended mode で使用する。

```js
import Vue from 'vue'
import Sugar from 'sugar'

Sugar.extend()
```

## ja ロケールのロード

デフォルトでは en ロケールしか利用できないので ja ロケールを設定する。

```js
import Vue from 'vue'
import Sugar from 'sugar'

Sugar.extend()
require('sugar/locales/ja')
Date.setLocale('ja')
```
