---
layout: post
title: "ActiveRecord で join と or と and が入り混じった場合"
date: '2017-03-17T16:25:48+0900'
main-class: dev
tags:
  - rails
  - ruby
---

```ruby
create_table :members do |t|
  t.string :name
  t.string :kana
  t.integer :age
end

create_table :emails do |t|
  t.references :member
  t.string :address
end
```

細かいオプションはさしおいてこんなテーブルがあるとして

```sql
SELECT *
FROM members m
JOIN emails e
ON e.member_id = m.id
WHERE m.age IN (21, 22, 23)
AND (m.name = 'foo' OR m.kana = 'foo' OR e.address = 'foo')
```

メンバー検索として結果的にこんな SQL を発行したい。

まずは `emails` を考えずに `members` だけに対象を絞る。

```ruby
Member.where(age: [21,22,23])
      .or(Member.where(name: 'foo'))
      .or(Member.where(kana: 'foo'))
#=> SELECT "members".* FROM "members" WHERE (("members"."age" IN (21, 22, 23) OR "members"."name" = $1) OR "members"."kana" = $2)  [["name", "foo"], ["kana", "foo"]]
```

```sql
-- 実質のクエリ
SELECT members.*
FROM members
WHERE (
  (
    members.age IN (21, 22, 23) OR
    members.name = 'foo'
  )
  OR members.kana = 'foo'
)
```

全ての条件が OR でつながってしまい意味合いが違ってしまう。  
正しくはこうする。

```ruby
Member.where(name: 'foo')
      .or(Member.where(kana: 'foo'))
      .where(age: [21,22,23])
#=> SELECT "members".* FROM "members" WHERE ("members"."name" = $1 OR "members"."kana" = $2) AND "members"."age" IN (21, 22, 23)  [["name", "foo"], ["kana", "foo"]]
```

```sql
-- 実質のクエリ
SELECT members.*
FROM members
WHERE (members.name = $1 OR members.kana = $2)
AND members.age IN (21, 22, 23)
```

さてここに `emails` を絡めていきたい。

```ruby
Member.joins(:emails)
      .where(name: 'foo')
      .or(Member.where(kana: 'foo'))
      .or(Email.where(address: 'foo'))
      .where(age: [21,22,23])
#=> ArgumentError: Relation passed to #or must be structurally compatible. Incompatible values: [:joins]
```

`or` に渡すのは構造的に同じものを渡せというエラーになった。

```ruby
scope = Member.joins(:emails)
scope.where(name: 'foo')
     .or(scope.where(kana: 'foo'))
     .or(scope.where(emails: { address: 'foo' }))
     .where(age: [21,22,23])
#=> ArgumentError: Relation passed to #or must be structurally compatible. Incompatible values: [:references]
```

これでもダメはツライ。

```ruby
scope = Member.joins(:emails)
scope.where(name: 'foo')
     .or(scope.where(kana: 'foo'))
     .or(scope.where(id: Email.where(address: 'foo')))
     .where(age: [21,22,23])
#=> SELECT "members".* FROM "members" INNER JOIN "emails" ON "emails"."member_id" = "members"."id" WHERE (("members"."name" = $1 OR "members"."kana" = $2) OR "members"."id"  IN (SELECT "emails"."id" FROM "emails" WHERE "emails"."address" = $3)) AND "members"."age" IN (21, 22, 23)  [["name", "foo"], ["kana", "foo"], ["address", "foo"]]
```

```sql
-- 実質のクエリ
SELECT members.* 
FROM members 
INNER JOIN emails 
ON emails.member_id = members.id 
WHERE (
  (
    members.name = 'foo' OR
    members.kana = 'foo'
  ) OR
  members.id IN (
    SELECT emails.id
    FROM emails
    WHERE emails.address = 'foo'
  )
)
AND members.age IN (21, 22, 23)
```

結局これで妥協した。

ちなみに Arel を使うとこうなる。

```ruby
age = Member.arel_table[:age].in([21, 22, 23])
name = Member.arel_table[:name].eq('foo')
kana = Member.arel_table[:kana].eq('foo')
mail = Email.arel_table[:address].eq('foo')
Member.joins(:emails).where(age.and(name.or(kana).or(mail)))
#=> SELECT "members".* FROM "members" INNER JOIN "emails" ON "emails"."member_id" = "members"."id" WHERE ("members"."generation" IN (21, 22, 23) AND (("members"."given_name" = 'foo' OR  "members"."given_kana" = 'foo') OR "emails"."address" = 'foo'))
```

```sql
-- 実質のクエリ
SELECT members.* 
FROM members 
INNER JOIN emails 
ON emails.member_id = members.id 
WHERE (
  members.generation IN (21, 22, 23) AND
  (
    (
      members.given_name = 'foo' OR 
      members.given_kana = 'foo'
    ) OR 
    emails.address = 'foo'
  )
)
```

`or` はできることの制限が厳しく発行したいSQLからどのように書けばよいかが直感的ではない。  
Arel は内部ライブラリなのであまり使わないほうがよいことは承知しているがカッコを使った制御が直感的に行える。  
さて、あなたはどちらを選びますか？
