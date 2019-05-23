---
layout: post
title: "Swiftで画像が左寄せでタイトルが中央なボタンを作る"
date: '2019-05-23T12:40:28+0900'
main-class: dev
tags:
  - swift
---

4月に転職して現在初めて iOS の改修をやっている。

![](/assets/img/20190523_image1.png)

こんな感じのデザインを実装することになって非常に困った。  

まずデフォルトで画像とタイトルを表示するとこんな風になる。

![](/assets/img/20190523_image2.png)
これの画像だけを左側に固定しタイトルは長さに合わせてセンタリングしたい。

左揃えを `imageEdgeInsets.left` と `titleEdgeInsets.left` を操作するして似たような事は先日やったのだが、これだとタイトルのセンタリングが大変。文字の幅の自動計算とかやりたくない。

Swift 初めて2ヶ月の iOS App の API どころか Swift の構文すらまだまだ怪しい状態なので当たりも付けづらく、ぐぐってみてもなかなか有用な情報を見つけられなかった。

とはいえ一晩あけるとなんとなくピンとくる物もあって `imageRectForContentRect(_ contentRect: CGRect) -> CGRect` を override すれば出来そうな気がしてきたので試してみた。

まずはデフォルトの状態でどんな `CGRect` を返しているのかを調べよう。

なんと現在は `imageRect(forContentRect contentRect: CGRect) -> CGRect` に名前が変わっているようだ。  
この2ヶ月近く Swift をやって、こういう非互換に腐るほど出会ってきた。enum の名前が全然違っていて `FooBarNormal` を `.normal` に直すとかザラだ。  
おかげでググった結果が陳腐化していることも多々である。さっさと落ち着いてくれ。

とまあ Swift の愚痴は置いておいてとりあえずこんなコードを仕込んだ。

```swift
class LeftFixedImageButton: UIButton {
    override func imageRect(forContentRect contentRect: CGRect) -> CGRect {
        let rect = super.imageRect(forContentRect: contentRect)
        print(rect)
        return rect
    }
}
```

```
(123.5, 18.0, 24.0, 24.0)
(131.5, 18.0, 24.0, 24.0)
(151.0, 18.0, 24.0, 24.0)
(151.0, 18.0, 24.0, 24.0)
(143.0, 18.0, 24.0, 24.0)
(143.0, 18.0, 24.0, 24.0)
(151.0, 18.0, 24.0, 24.0)
(151.0, 18.0, 24.0, 24.0)
(143.0, 18.0, 24.0, 24.0)
(143.0, 18.0, 24.0, 24.0)
```

よしよし、この `CGRect` は `UIButton` 内部での相対座標になっているっぽい。なので、x だけ固定化した `CGRect` を返してやれば良さそうだ。

```swift
class LeftFixedImageButton: UIButton {
    override func imageRect(forContentRect contentRect: CGRect) -> CGRect {
        let rect = super.imageRect(forContentRect: contentRect)
        return CGRect(x: 20.0, y: rect.minY, width: rect.width, height: rect.height)
    }
}
```

本来なら `@IBDesignable` と `@IBInspectable` を使って外部から値を設定できるようにするべきなのかもしれないが、設定ミスがあって画面によって画像の位置がずれるとかになっても困るので固定値とした。

これの結果、こんな風に表示された。

![](/assets/img/20190523_image3.png)

なんか微妙にタイトルがずれている気がする。少し考えて、これはもともと画像込みでセンタリングされているから画像の分だけずらす必要があるなと思った。

で当然 `titleRect(forContentRect contentRect: CGRect) -> CGRect` もあるわけなのでこんな風にしてみた。

```swift
class LeftFixedImageButton: UIButton {
    override func titleRect(forContentRect contentRect: CGRect) -> CGRect {
        let rect = super.titleRect(forContentRect: contentRect)
        return CGRect(x: rect.minX - 24.0, y: rect.minY, width: rect.width, height: rect.height)
    }
    
    override func imageRect(forContentRect contentRect: CGRect) -> CGRect {
        let rect = super.imageRect(forContentRect: contentRect)
        return CGRect(x: 20.0, y: rect.minY, width: rect.width, height: rect.height)
    }
}
```

![](/assets/img/20190523_image4.png)

うーん、ずれすぎている。ああ、センタリングだから画像の半分だけずらさないと行けないのか。

```swift
class LeftFixedImageButton: UIButton {
    override func titleRect(forContentRect contentRect: CGRect) -> CGRect {
        let rect = super.titleRect(forContentRect: contentRect)
        if let imgView = self.imageView {
            return CGRect(x: rect.minX - imgView.image!.size.width / 2, y: rect.minY, width: rect.width, height: rect.height)
        }
        return rect
    }
    
    override func imageRect(forContentRect contentRect: CGRect) -> CGRect {
        let rect = super.imageRect(forContentRect: contentRect)
        return CGRect(x: 20.0, y: rect.minY, width: rect.width, height: rect.height)
    }
}
```

画像のあるなし、画像のサイズが違うことも考慮してこうしてみた。これでようやく目的が達成できた。良かった
