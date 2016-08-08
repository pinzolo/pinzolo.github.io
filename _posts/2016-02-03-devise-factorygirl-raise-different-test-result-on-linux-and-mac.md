---
layout: post
title: FactoryGirlを使用したDeviseのテストでLinuxとMacでのテスト結果が異なった話
date: '2016-02-03T00:18:00.000+09:00'
author: pinzolo
main-class: dev
tags:
- rails
- ruby
- test
- linux
- devise
- mac
---

[tail -f pinzo.log: Deviseの有効期限設定をテストする](http://blog.mkt-sys.jp/2015/12/testing-devise-timelimits.html) で書いた有効期限検証のコードで不思議な事が起こった。Macでは正常にパスするのだが、Amazon Linux上ではパスしない。 ミニマムなコードで示すとこんな感じ

```ruby
# confirmations_controller_test.rb
require 'test_helper'

class ConfirmationsControllerTest < ActionController::TestCase

  setup do
    @request.env['devise.mapping'] = Devise.mappings[:user]
  end

  test '登録して10日以内なら確認可' do
    user = create(:user)
    Time.stub(:now, user.confirmation_sent_at + 10.days) do
      get :show, confirmation_token: user.confirmation_token
    end
    assert user.reload.confirmed?
  end
end
```

```ruby
# config/initializers/devise.rb
Devise.setup do |config|
  # some settings
  
  config.confirm_within = 10.days

  # some settings
end
```

```ruby
# user_factory.rb
FactoryGirl.define do
  factory :user do
    email 'user@example.com'
    password 'newSecurePassw0rd'
    confirmation_token 'xxxxxxxxxxxxxxxx'
    confirmation_sent_at Time.zone.now.yesterday
  end
end
```

で、こんなデバッグコードを仕込んで実行してみた

```ruby
# devise_confirmable.rb
module Devise
  module Models
    module Confirmable
      
      # some code

      protected

        # some code

        def confirmation_period_expired?
          t1, t2, t3 = Time.now, self.confirmation_sent_at, self.confirmation_sent_at + self.class.confirm_within
          Rails.logger.debug("[devise][now]     to_s: #{t1.to_s}, to_i: #{t1.to_i}, usec: #{t1.usec}, subsec: #{t1.subsec}")
          Rails.logger.debug("[devise][sent_at] to_s: #{t2.to_s}, to_i: #{t2.to_i}, usec: #{t2.usec}, subsec: #{t2.subsec}")
          Rails.logger.debug("[devise][added]   to_s: #{t3.to_s}, to_i: #{t3.to_i}, usec: #{t3.usec}, subsec: #{t3.subsec}")
          Rails.logger.debug("[devise] now > added: #{t1 > t3}")
          Rails.logger.debug("[devise] now.subsec > added.subsec: #{t1.subsec > added.subsec}")
          self.class.confirm_within && self.confirmation_sent_at && (Time.now > self.confirmation_sent_at + self.class.confirm_within)
        end
        
        # some code
      end
    end
  end
```

```ruby
# confirmations_conroller_test.rb
require 'test_helper'

class ConfirmationsControllerTest < ActionController::TestCase

  setup do
    @request.env['devise.mapping'] = Devise.mappings[:user]
  end

  test '登録して10日以内なら確認可' do
    user = create(:user)
    Time.stub(:now, user.confirmation_sent_at + 10.days) do
      t1, t2 = user.confirmation_sent_at, user.confirmation_sent_at + 30.days
      Rails.logger.debug("[test-code][sent_at] to_s: #{t1.to_s}, to_i: #{t1.to_i}, usec: #{t1.usec}, subsec: #{t1.subsec}")
      Rails.logger.debug("[test-code][added]   to_s: #{t2.to_s}, to_i: #{t2.to_i}, usec: #{t2.usec}, subsec: #{t2.subsec}")
      get :show, confirmation_token: user.confirmation_token
    end
    assert user.reload.confirmed?
  end
end
```

Macで実行するとこんな感じ

```
[test-code][sent_at] to_s: 2016-02-01 23:51:31 +0900, to_i: 1454338291, usec: 197593, subsec: 197593/1000000
[test-code][added]   to_s: 2016-02-11 23:51:31 +0900, to_i: 1456930291, usec: 197593, subsec: 197593/1000000
[devise][now]     to_s: 2016-02-11 23:51:31 +0900, to_i: 1456930291, usec: 197593, subsec: 197593/1000000
[devise][sent_at] to_s: 2016-02-01 23:51:31 +0900, to_i: 1454338291, usec: 197593, subsec: 197593/1000000
[devise][added]   to_s: 2016-02-11 23:51:31 +0900, to_i: 1456930291, usec: 197593, subsec: 197593/1000000
[devise] now > added: false
[devise] now.subsec > added.subsec: false
```

Amazon Linuxで実行するとこんな感じ

```
[test-code][sent_at] to_s: 2016-02-01 23:53:20 +0900, to_i: 1454338400, usec: 369658, subsec: 369658841/1000000000
[test-code][added]   to_s: 2016-02-11 23:53:20 +0900, to_i: 1456930400, usec: 369658, subsec: 369658841/1000000000
[devise][now]     to_s: 2016-02-11 23:53:20 +0900, to_i: 1456930400, usec: 369658, subsec: 369658841/1000000000
[devise][sent_at] to_s: 2016-02-01 23:53:20 +0900, to_i: 1454338400, usec: 369658, subsec: 184829/500000
[devise][added]   to_s: 2016-02-11 23:53:20 +0900, to_i: 1456930400, usec: 369658, subsec: 184829/500000
[devise] now > added: true
[devise] now.subsec > added.subsec: true
```

usecまでは同じなのだが、subsec をみると Amazon Linux では、桁落ちが発生している。  
ためしにそれぞれで `Time.now.subsec` としてみる。

```bash
# mac
$ ruby -e 'puts Time.now.subsec'
276987/1000000

# Amazon Linux
$ ruby -e 'puts Time.now.subsec'
704462593/1000000000
```

つまりこういうことが起こっている 

1. OSにより `Time#subsec` が返す精度が異なる
1. FactoryGirlが `create` で返すのは、コードで指定された値を格納したオブジェクトであり、DBに登録後取得したものではないので `confirmation_sent_at` はそのままの精度である。つまり、スタブで突っ込んでいるのは元の精度
1. DB（sqlite）に格納するとき、DBの型に合わせて精度の桁落ちが発生する
1. 実際に処理されるときは、DBから取得したデータなので桁落ちが発生したデータになる
1. DB格納前の元の精度の値と、DBから取得した桁落ちした値を比較しているため期限を超えたことになってしまう
1. Mac上ではたまたま、`Time#subsec`の精度がsqliteの精度と同じだったため桁落ちが発生せず正常に動作する

これを避けるためには、スタブに突っ込む値をDBから取得したものにすれば良さそうだ。たとえばこんな感じ

```ruby
# confirmations_controller_test.rb
require 'test_helper'

class ConfirmationsControllerTest < ActionController::TestCase

  setup do
    @request.env['devise.mapping'] = Devise.mappings[:user]
  end

  test '登録して10日以内なら確認可' do
    user = create(:user).reload
    Time.stub(:now, user.confirmation_sent_at + 10.days) do
      get :show, confirmation_token: user.confirmation_token
    end
    assert user.reload.confirmed?
  end
end
```

ちなみに Mac でも、桁落ちを引き起こすことは可能で、こんな感じで usec を超えた範囲を指定すれば桁落ちさせられる。

```ruby
# user_factory.rb
FactoryGirl.define do
  factory :user do
    email 'user@example.com'
    password 'newSecurePassw0rd'
    confirmation_token 'xxxxxxxxxxxxxxxx'
    confirmation_sent_at '2016-02-02 12:34:56.1234567'
  end
end
```

あー疲れた、腹減った

