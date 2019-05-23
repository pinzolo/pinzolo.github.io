---
layout: post
title: Deviseで複数モデルを利用した場合、ログアウトすると全てのスコープでログアウトされてしまう
date: '2016-01-30T19:05:00.000+09:00'
author: pinzolo
main-class: dev
tags:
- devise
- rails
- ruby
---

管理者とユーザーでのログイン機能が存在し、別モデルで管理したい場合、Devise を使うと `scoped_views` をtrueにすれば簡単に実装できる。（参考：[Ruby - Railsでdeviseひとつで複数モデルを管理しよう - Qiita](http://qiita.com/Yama-to/items/54ab4ce08e126ef7dade)）
しかし、デフォルトの場合 Devise のログアウトは全てのスコープでログアウトしてしまう。つまり管理者とユーザーでログインしていた場合、管理者としてログアウトすると同時にユーザーとしてもログアウトしてしまう

これを防ぎたい場合、`config/initializers/devise.rb` にて `config.sign_out_all_scopes = false` としてやればよい。 初期状態ではこの設定はコメントアウトされているので、コメントアウトを外しfalseに設定するだけで、スコープごとのサインアウトが実装できる。

テストコード込みのサンプルコードはこんな感じ。 

```ruby
# devise.rb
Devise.setup do |config|
  # 複数モデルを可能にする
  config.scoped_views = true
  # スコープごとのサインアウトを可能にする
  # デフォルトの状態ではコメントアウトされているので、コメントアウトを外して false を設定する
  config.sign_out_all_scopes = false
end
```

```ruby
# sessions_controller_test.rb
require 'test_helper'

class Admins::SessionsControllerTest < ActionController::TestCase
  def setup
    @request.env['devise.mapping'] = Devise.mappings[:admin]
    @admin = create(:admin)
    @user = create(:user)
  end

  test '管理者としてサインアウトしても、ユーザーとしてはサインアウトしない' do
    sign_in(@admin)
    sign_in(@user)
    delete :destroy
    assert_not @controller.send(:all_signed_out?)
    # assert @controller.signed_in?(@user) は動かなかった
  end
end
```

