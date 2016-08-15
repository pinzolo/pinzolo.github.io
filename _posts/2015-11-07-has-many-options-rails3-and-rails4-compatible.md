---
layout: post
title: Rails3とRails4のhas_manyオプションの差分を吸収する
date: '2015-11-07T12:39:00.000+09:00'
author: pinzolo
main-class: dev
tags:
- rails
- ruby
---

Rails3とRails4の違いの1つに `has_many` のオプションがある。

```ruby
# Rails3
class Course < ActiveRecord::Base
  has_many :students, order: :name, include: [:parents, :brothers], dependent: :destroy
end

# Rails4
class Course < ActiveRecord::Base
  has_many :students, ->{ order(:name).includes(:parents, :brothers) }, dependent: :destroy
end
```

Rails4では `order` と `include` が使えなくなってる。

しかし、1つのソースでRails3とRails4に対応したい場合どうしようか？

```ruby
module AssocOpts
  extend ActiveSupport::Concern

  module ClassMethods
    def assoc_opts(options)
      return [options] if Gem::Version.new(Rails.version) < Gem::Version.new('4.0.0')

      order_option = options.delete(:order)
      include_option = options.delete(:include)
      if order_option && include_option
        [Proc.new { order(order_option).includes(include_option) }, options]
      elsif order_option
        [Proc.new { order(order_option) }, options]
      elsif include_option
        [Proc.new { includes(include_option) }, options]
      else
        [options]
      end
    end
  end
end

# Rails3 and Rails4
class Course < ActiveRecord::Base
  include AssocOpts

  has_many :students, *assoc_opts(order: :name, include: [:parents, :brothers], dependent: :destroy)
end
```

とまあこんな感じでどうかな？
