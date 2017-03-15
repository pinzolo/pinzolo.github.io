---
layout: post
title: "YubinBangoをTurbolinks下で使う場合"
date: '2017-03-15T10:47:29+0900'
main-class: dev
tags:
  - javascript
  - rails
  - turbolinks
  - yubinbango
---

[YubinBango](https://yubinbango.github.io/)というまあ郵便番号から住所検索するよくあるやつだけど、HTMLのclassベースでできるのでとても便利なやつがある。  
これを Rails で Turbolinks 使いながらやる場合は一手間必要ですよというお話。（Rails 5.0.1, Turbolinks 5.0.1）

まずは `app/views/layouts/application.html.erb` に下記を加える。

```html
<script src="https://yubinbango.github.io/yubinbango/yubinbango.js" charset="UTF-8"></script>
```

次にフォームに class を仕込んでいく。  
`form_for` に直接 `h-adr` を仕込んでもいいけど `div` にしておけば自宅・勤務先のように、1つのフォームに複数配置できる。

```erb
  <div class="h-adr">
    <span class="p-country-name" style="display:none;">Japan</span>
    <div class="form-group">
      <%= f.label :zip_code, class: "col-sm-2 control-label" %>
      <div class="col-sm-2">
        <%= f.text_field :home_zip_code, class: "form-control p-postal-code" %>
      </div>
    </div>
    <div class="form-group">
      <%= f.label :address, class: "col-sm-2 control-label" %>
      <div class="col-sm-10">
        <%= f.text_field :home_address, class: "form-control p-region p-locality p-street-address p-extended-address" %>
      </div>
    </div>
  </div>
```

これで基本的には大丈夫なのだが、このままでは下記のようになってしまう。

* http://localhost:3000/members/new に直接アクセスすると機能する
* http://localhost:3000/members にアクセスし、リンクから http://localhost:3000/members/new にアクセスすると機能しない

要するに、turbolinks 経由で遷移すると動かない。  
なので `app/assets/javascripts/application.js` に一手間加えてやる。

```js
$(document).ready(function() {
  $(document).on('turbolinks:render', function() {
    if ($('.h-adr').length) {
      new YubinBango.MicroformatDom();
    }
  });
});
```

`turbolinks:render` は遷移する度に発生するので、その度に `h-adr` を class に持つ要素があれば手動で実行してあげればよい。
