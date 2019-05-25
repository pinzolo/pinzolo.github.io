---
layout: post
title: "VeeValidateを使ってみる"
date: '2017-10-25T23:48:13+0900'
tags:
  - javascript
  - vue.js
---

Vue.js アプリケーションのバリデーションに [baianat/vee\-validate: Simple Vue\.js input validation plugin](https://github.com/baianat/vee-validate) を使ってみた。いくつかはまったこと。

## name

`name` 属性、もしくは `data-vv-name` 属性がないとフィールドが特定できない。

## 正規表現

```html
<input type="text"
       name="tel"
       placeholder="03-1234-5678"
       v-model="tel"
       v-validate="'regex:^0[1-9][0-9]{0,4}-[0-9]{1,5}-[0-9]{1,5}$'">
```

このように書くと `SyntaxError: Invalid flags supplied to RegExp constructor '4}-[0-9]{1,5}-[0-9]{1,5}$'` というエラーが出る。

[Regex error · Issue \#223 · baianat/vee\-validate](https://github.com/baianat/vee-validate/issues/223)
によるとこの形式ではパイプやカンマを含む正規表現は動かないらしい。

```html
<input type="text"
       name="tel"
       placeholder="03-1234-5678"
       v-model="tel"
       v-validate="{ regex: /^0[1-9][0-9]{0,4}-[0-9]{1,5}-[0-9]{1,5}$/ }">
```

のようにオブジェクトで書けばよい。また、正規表現オブジェクトではなく文字列でもよい。

## メッセージの日本語化

```js
Vue.use(VeeValidate, { locale: 'ja' })
```

これだけだと `You are setting the validator locale to a locale that is not defined in the dictionary. English messages may still be generated.` と警告がでて英語のメッセージになる。

```js
import VeeValidate from 'vee-validate'
import VeeValidateJaLocale from 'vee-validate/dist/locale/ja'

VeeValidate.Validator.addLocale(VeeValidateJaLocale)
Vue.use(VeeValidate, { locale: 'ja' })
```

としてやる必要がある。

フィールド名を日本語化するには `data-vv-as` 属性を使う。

```html
<input type="text"
       name="tel"
       placeholder="03-1234-5678"
       data-vv-as="電話番号"
       v-model="tel"
       v-validate="{ regex: /^0[1-9][0-9]{0,4}-[0-9]{1,5}-[0-9]{1,5}$/ }">
```

こんな感じ。
