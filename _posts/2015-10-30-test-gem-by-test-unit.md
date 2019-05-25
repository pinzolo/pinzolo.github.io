---
layout: post
title: 自作gemのテストを test-unit で行う
date: '2015-10-30T19:38:00.000+09:00'
author: pinzolo
tags:
- ruby
- rubygems
---

久しぶりに自作 gem でも作るかと `bundle gem -t` とすると自動的に spec フォルダと .rspec が作成された。いやいや、test-unit 使いたいんだってば。

仕方ないので自分で設定することに。 gemspec に `spec.add_development_dependency 'test-unit'` を追加し、Rakefile にこんな感じに設定を書くだけだった。

```ruby
require 'bundler/gem_tasks'
require 'rake/testtask'

Rake::TestTask.new do |t|
  t.libs << 'test'
  t.test_files = FileList['test/my_gem/*_test.rb']
  t.verbose = true
end
task default: :test
```
