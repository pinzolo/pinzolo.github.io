---
layout: post
title: Deviseにてシステムからユーザーのメールアドレスを変更してもメールを送信しない
date: '2015-12-09T10:31:00.001+09:00'
author: pinzolo
tags:
- devise
- rails
- ruby
---

Devise を使用していて、手順を踏まずにシステムにてメールアドレスを変更すると保存時にメールが送信されてしまう。  
メールを送信したくない場合は `skip_reconfirmation!` を使用する。

```ruby
def change_user_email(user)
  user.email = 'new-email@example.com'
  user.skip_reconfirmation!
  user.save
end

# テストコード
test 'ユーザーのメールアドレスを変更しても、メールが送信されないこと' do
  assert_no_difference 'ActionMailer::Base.deliveries.size' do
    change_user_email(@user)
  end
end
```

なお、新規作成時に確認手順を飛ばしたい場合は `skip_confirmation!` を使う。
