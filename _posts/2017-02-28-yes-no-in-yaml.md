---
layout: post
title: "YAMLでyes,noというキーは使用できない"
date: '2017-02-28T21:32:05+0900'
tags:
  - rails
  - yaml
---

Rails にて true, false に対するマークを locale に登録しようとしてこんな yml を書いた。

```yml
ja:
  label:
    yes: '○'
    no: '×'
```

これで `<%= t('label.yes') %>` としても translation missing となって表示されない。

```
$ bin/rails console
[1] pry(main)> I18n.t('label')
=> {true=>"○", false=>"×"}
```

yes, no はそれぞれ true, false に変換されてしまうらしい。

```
$ pry
[1] pry(main)> require 'yaml'
[2] pry(main)> y YAML.load(<<EOS)
[2] pry(main)* foo:
[2] pry(main)*   yes: 'Y'
[2] pry(main)*   no: 'N'
[2] pry(main)* EOS
=> {"foo"=>{true=>"Y", false=>"N"}}
```

YAMLとはそういうものらしい。

こういう場合は、キーを囲ってやればよいそうだ。

```yml
ja:
  label:
    "yes": '○'
    "no": '×'
```

これでOK
