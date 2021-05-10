---
layout: post
title: rails-flog を Rails 6.1 に対応
date: '2021-03-07T09:23:19+0900'
tags:
  - ruby
  - rubygems
---

[【オンライン】Kyoto\.rb Meetup 20210307 \- Kyoto\.rb \| Doorkeeper](https://kyotorb.doorkeeper.jp/events/118749) での作業ログ

まずはローカルの rails 最新にする

```
$ bundle update
Ignoring nio4r-2.4.0 because its extensions are not built. Try: gem pristine nio4r --version 2.4.0
Ignoring nokogiri-1.10.4 because its extensions are not built. Try: gem pristine nokogiri --version 1.10.4
Ignoring nokogiri-1.10.3 because its extensions are not built. Try: gem pristine nokogiri --version 1.10.3
Ignoring sqlite3-1.3.13 because its extensions are not built. Try: gem pristine sqlite3 --version 1.3.13
Ignoring websocket-driver-0.7.1 because its extensions are not built. Try: gem pristine websocket-driver --version 0.7.1
Fetching gem metadata from https://rubygems.org/.........
Fetching gem metadata from https://rubygems.org/.
Resolving dependencies....
Fetching rake 13.0.3 (was 12.3.3)
Installing rake 13.0.3 (was 12.3.3)
Fetching concurrent-ruby 1.1.8 (was 1.1.7)
Installing concurrent-ruby 1.1.8 (was 1.1.7)
Fetching i18n 1.8.9 (was 1.8.7)
Installing i18n 1.8.9 (was 1.8.7)
Fetching minitest 5.14.4 (was 5.11.3)
Installing minitest 5.14.4 (was 5.11.3)
Fetching tzinfo 2.0.4 (was 1.2.9)
Installing tzinfo 2.0.4 (was 1.2.9)
Using zeitwerk 2.4.2
Fetching activesupport 6.1.3 (was 6.0.3.4)
Installing activesupport 6.1.3 (was 6.0.3.4)
Using builder 3.2.4
Using erubi 1.10.0
Using mini_portile2 2.5.0
Using racc 1.5.2
Using nokogiri 1.11.1 (x86_64-darwin)
Using rails-dom-testing 2.0.3
Using crass 1.0.6
Fetching loofah 2.9.0 (was 2.8.0)
Installing loofah 2.9.0 (was 2.8.0)
Using rails-html-sanitizer 1.3.0
Fetching actionview 6.1.3 (was 6.0.3.4)
Installing actionview 6.1.3 (was 6.0.3.4)
Using rack 2.2.3
Using rack-test 1.1.0
Fetching actionpack 6.1.3 (was 6.0.3.4)
Installing actionpack 6.1.3 (was 6.0.3.4)
Fetching nio4r 2.5.7 (was 2.5.4)
Installing nio4r 2.5.7 (was 2.5.4) with native extensions
Using websocket-extensions 0.1.5
Using websocket-driver 0.7.3
Fetching actioncable 6.1.3 (was 6.0.3.4)
Installing actioncable 6.1.3 (was 6.0.3.4)
Using globalid 0.4.2
Fetching activejob 6.1.3 (was 6.0.3.4)
Installing activejob 6.1.3 (was 6.0.3.4)
Fetching activemodel 6.1.3 (was 6.0.3.4)
Installing activemodel 6.1.3 (was 6.0.3.4)
Fetching activerecord 6.1.3 (was 6.0.3.4)
Installing activerecord 6.1.3 (was 6.0.3.4)
Using mimemagic 0.3.5
Using marcel 0.3.3
Fetching activestorage 6.1.3 (was 6.0.3.4)
Installing activestorage 6.1.3 (was 6.0.3.4)
Using mini_mime 1.0.2
Using mail 2.7.1
Fetching actionmailbox 6.1.3 (was 6.0.3.4)
Installing actionmailbox 6.1.3 (was 6.0.3.4)
Fetching actionmailer 6.1.3 (was 6.0.3.4)
Installing actionmailer 6.1.3 (was 6.0.3.4)
Fetching actiontext 6.1.3 (was 6.0.3.4)
Installing actiontext 6.1.3 (was 6.0.3.4)
Using amazing_print 1.2.2
Using anbt-sql-formatter 0.1.0
Fetching ast 2.4.2 (was 2.4.0)
Installing ast 2.4.2 (was 2.4.0)
Using bundler 1.17.2
Fetching json 2.5.1 (was 2.2.0)
Installing json 2.5.1 (was 2.2.0) with native extensions
Fetching docile 1.3.5 (was 1.3.2)
Installing docile 1.3.5 (was 1.3.2)
Using simplecov-html 0.10.2
Using simplecov 0.16.1
Using sync 0.5.0
Fetching tins 1.28.0 (was 1.21.1)
Installing tins 1.28.0 (was 1.21.1)
Using term-ansicolor 1.7.1
Fetching thor 1.1.0 (was 0.20.3)
Installing thor 1.1.0 (was 0.20.3)
Using coveralls 0.8.23
Using method_source 1.0.0
Fetching parallel 1.20.1 (was 1.17.0)
Installing parallel 1.20.1 (was 1.17.0)
Fetching parser 3.0.0.0 (was 2.6.3.0)
Installing parser 3.0.0.0 (was 2.6.3.0)
Fetching railties 6.1.3 (was 6.0.3.4)
Installing railties 6.1.3 (was 6.0.3.4)
Using sprockets 4.0.2
Using sprockets-rails 3.2.2
Fetching rails 6.1.3 (was 6.0.3.4)
Installing rails 6.1.3 (was 6.0.3.4)
Using rails-flog 1.6.1 from source at `.`
Using rainbow 3.0.0
Fetching regexp_parser 2.1.1
Installing regexp_parser 2.1.1
Fetching rexml 3.2.4
Installing rexml 3.2.4
Fetching rubocop-ast 1.4.1
Installing rubocop-ast 1.4.1
Fetching ruby-progressbar 1.11.0 (was 1.10.1)
Installing ruby-progressbar 1.11.0 (was 1.10.1)
Fetching unicode-display_width 2.0.0 (was 1.6.0)
Installing unicode-display_width 2.0.0 (was 1.6.0)
Fetching rubocop 1.11.0 (was 0.74.0)
Installing rubocop 1.11.0 (was 0.74.0)
Fetching sqlite3 1.4.2 (was 1.4.1)
Installing sqlite3 1.4.2 (was 1.4.1) with native extensions
Bundle updated!
```

```
$ bundle exec rake
/Users/pinzolo/dev/github.com/pinzolo/rails-flog/rails-flog.gemspec:17: warning: global variable `$INPUT_RECORD_SEPARATOR' not initialized
-- create_table(:books, {:force=>true})
   -> 0.0160s
Run options: --seed 35625

# Running:

..........................................

Finished in 0.645701s, 65.0456 runs/s, 175.0036 assertions/s.
42 runs, 113 assertions, 0 failures, 0 errors, 0 skips
[Coveralls] Outside the CI environment, not sending data.
```

警告出ているので直す。そもそも現在は gemspec はどう書くのが正解なのか？

```sh
$ bundle gem foo
$ cat foo/foo.gemspec
```

```gemfile
code:ruby
 require_relative 'lib/foo/version'
 
 Gem::Specification.new do |spec|
   spec.name          = "foo"
   spec.version       = Foo::VERSION
   spec.authors       = ["pinzolo"]
   spec.email         = ["pinzolo@gmail.com"]
 
   spec.summary       = %q{TODO: Write a short summary, because RubyGems requires one.}
   spec.description   = %q{TODO: Write a longer description or delete this line.}
   spec.homepage      = "TODO: Put your gem's website or public repo URL here."
   spec.license       = "MIT"
   spec.required_ruby_version = Gem::Requirement.new(">= 2.3.0")
 
   spec.metadata["allowed_push_host"] = "TODO: Set to 'http://mygemserver.com'"
 
   spec.metadata["homepage_uri"] = spec.homepage
   spec.metadata["source_code_uri"] = "TODO: Put your gem's public repo URL here."
   spec.metadata["changelog_uri"] = "TODO: Put your gem's CHANGELOG.md URL here."
 
   # Specify which files should be added to the gem when it is released.
   # The `git ls-files -z` loads the files in the RubyGem that have been added into git.
   spec.files         = Dir.chdir(File.expand_path('..', __FILE__)) do
     `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
   end
   spec.bindir        = "exe"
   spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
   spec.require_paths = ["lib"]
 end
```

`allowed_push_host` は間違って rubygems にアップロードさせたくない時とかに使うのか。いらないな  
`source_code_uri` はどうするか？`homepage_uri` と同じなんだけどな。同じにしておこう  
`changelog_uri` CHANGELOG.md 書いてないや。README.md から分離するか  
作業内容報告できるように Draft PR 作成しておく -> [https://github.com/pinzolo/rails-flog/pull/27](https://github.com/pinzolo/rails-flog/pull/27)  
ruby 2.7.2 でテストする

```
Traceback (most recent call last):
        2: from /Users/pinzolo/.anyenv/envs/rbenv/versions/2.7.2/bin/bundle:23:in `<main>'
        1: from /Users/pinzolo/.anyenv/envs/rbenv/versions/2.7.2/lib/ruby/2.7.0/rubygems.rb:296:in `activate_bin_path'
/Users/pinzolo/.anyenv/envs/rbenv/versions/2.7.2/lib/ruby/2.7.0/rubygems.rb:277:in `find_spec_for_exe': Could not find 'bundler' (1.17.2) required by your /Users/pinzolo/dev/github.com/pinzolo/rails-flog/Gemfile.lock. (Gem::GemNotFoundException)
To update to the latest version installed on your system, run `bundle update --bundler`.
To install the missing version, run `gem install bundler:1.17.2`
```

げぇ。とりあえず `$ bundle update --bundler` する

```
 bundle exec rake
-- create_table(:books, {:force=>true})
   -> 0.0171s
Run options: --seed 25296

# Running:

..........................................

Finished in 0.340621s, 123.3042 runs/s, 331.7470 assertions/s.
42 runs, 113 assertions, 0 failures, 0 errors, 0 skips
[Coveralls] Outside the CI environment, not sending data.
```

ほい。OK

Ruby 2.7 を .travis.yml に追加  
EOL の Rails をテストバージョンから削除しよう  
5.2 以降が現在のサポートのようだ -> [https://guides.rubyonrails.org/maintenance_policy.html](https://guides.rubyonrails.org/maintenance_policy.html)  
Rails 5.2 が RUBY_VERSION >= 2.2.2 なので、残念ながら Ruby 2.3 と 2.4 を削除することは出来なさそうだ  
というわけで 6.1.x に関する excludes を追加する  
[https://travis-ci.org/github/pinzolo/rails-flog/builds/761758756](https://travis-ci.org/github/pinzolo/rails-flog/builds/761758756)  
通ってるのでヨシ

Ruby 3.0.0 対応はまた後日
