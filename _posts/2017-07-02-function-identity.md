---
layout: post
title: "Function.identity()"
date: '2017-07-02T14:11:27+0900'
tags:
  - java
---

オブジェクトの List から Map を作りたい場合、

```java
list.stream().collect(toMap(Foo::getKey, o -> o);
```

なんてよくやるけど、 o -> o がちょっとかっこわるいと思ってたら

```java
list.stream().collect(toMap(Foo::getKey, Function.identity());
```

とかけるらしい。タイピング数は増えるけど、慣れたらわかりやすいかも

