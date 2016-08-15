---
layout: post
title: Deviseの有効期限設定をテストする
date: '2015-12-10T15:26:00.001+09:00'
author: pinzolo
main-class: dev
tags:
- ruby
- rails
- devise
- testing
---

設定ファイル `config/initializers/devise.rb` はこんな感じとする。

```ruby
Devise.setup do |config|
  # 省略
  config.reset_password_within = 30.minutes
  config.confirm_within = 30.days
  # 省略
end
```

テストコードはこんな感じでかけた。

```ruby
require 'test_helper'

class Users::PasswordsControllerTest < ActionController::TestCase

  setup do
    @request.env['devise.mapping'] = Devise.mappings[:user]
    @user = create(:user)
  end
  
  test 'メールを送信して30分後まではトークンは有効' do
    post :create, user: { email: @user.email }
    before = @user.reload.encrypted_password
    Time.stub(:now, @user.reset_password_sent_at + 30.minutes) do
      put :update, user: { password: 'new-password', password_confirmation: 'new-password', reset_password_token: reset_password_token }
    end
    assert_not_equal @user.reload.encrypted_password, before
  end

  test 'メールを送信して30分を超えたらトークンは無効' do
    post :create, user: { email: @user.email }
    before = @user.reload.encrypted_password
    Time.stub(:now, @user.reset_password_sent_at + 30.minutes + 1.second) do
      put :update, user: { password: 'new-password', password_confirmation: 'new-password', reset_password_token: reset_password_token }
    end
    assert_equal @user.reload.encrypted_password, before
  end
end
```

```ruby
require 'test_helper'

class Users::ConfirmationsControllerTest < ActionController::TestCase

  setup do
    @request.env['devise.mapping'] = Devise.mappings[:user]
    @user = create(:user)
  end
  
  test '登録して30日以内なら確認可' do
    assert_not @user.confirmed?
    Time.stub(:now, @user.confirmation_sent_at + 30.days) do
      get :show, confirmation_token: @user.confirmation_token
    end
    assert user.reload.confirmed?
  end

  test '登録して30日以降なら確認不可' do
    assert_not @user.confirmed?
    Time.stub(:now, @user.confirmation_sent_at + 30.days + 1.second) do
      get :show, confirmation_token: @user.confirmation_token
    end
    assert_not @user.reload.confirmed?
  end
end
```

[Recoverable](https://github.com/plataformatec/devise/blob/0d941b7ba57cc5f04923d224c81bd0aa50a666b3/lib/devise/models/recoverable.rb#L86) では `reset_password_sent_at` と `reset_password_within.ago` を比較している。  
`ActiveSupport::Duration#ago` まで遡ると初期値である `Time.current` に対して演算していたので、最初は `Time.stub(:current, ...` のようにしていた。
しかし、[Confirmable](https://github.com/plataformatec/devise/blob/508c3418f99dcd7e2d3d908fc17fe15616d59281/lib/devise/models/confirmable.rb#L219) では、合算値を `Time.now` と比較している。そのため、`Time.current` は通らないのでこのやり方ではだめだった。  
結局は `Time.now` をスタブ化したらよかったわけだが、こういう同質的な処理は同じ書き方をしてほしいなーとおもった昼下がり。
