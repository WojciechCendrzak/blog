---
title: 'Tagged Template Literal in table jest testing'
date: '2022-02-17'
author: 'Wojciech Cendrzak'
image: '/images/tagged-template-literal-jest-test.png'
tags: 'TDD, jest, TypeScript, nodejs'
isPublished: true
---

Have you ever implemented simple logic that, though it looked very trivial at first glance, was actually buggy?
Omitted parenthesis, wrong operator or simply not all edge cases covered?
Then, have been running an application, again and again, only to discover yet another fault?
Or even worse, have to wait a while for CD have been completed, follow complicated reproduction steps just to notice yet another one?

In this article, we will solve all those issues that will significantly increase trust in a logic you've created!

We gonna use a **T**est **D**riven **D**evelopment with jest `Tagged Template Literal` approach.

`jest` is a widely known testing solution.
It offers `string template approach`, rather merely recognized but definitely underprices.

## Tagged Template Literal

Shortly speaking, it allows you to create one test but feed it with different testing conditions.
It makes a test more condensed and much more readable and flexible.
This also makes it easy to add a new edge case or edit an existing one.

See more [here](https://jestjs.io/docs/api#2-testeachtablename-fn-timeout)

## Test Driven Development

Let's warm up with a very trivial example first in the TDD way, which stands for:

1. create a test with only one case (test will fail)
2. create a function with simply implementation (to fulfill the test)
3. add more test cases and modify the function to satisfy it if needed
4. refactor function to increase performance or readability if needed
5. run the test to check whether new changes didn't break anything

## Example 1: warming up

Let's add some numbers.
Who doesn't need to add numbers?

### Stage 1. create a test first

As the `TDD` approach stands, we will create a test that fails.
As we don't have the function implemented yet, let's use the mocked function.

```ts
const add = jest.fn();

describe(add.name, () =>
  test.each`
    a    | b    | expected
    ${2} | ${2} | ${4}
  `('$a + $b -> $expected', ({ a, b, expected }) => {
    expect(add(a, b)).toBe(expected);
  })
);
```

Test failed as expected due to mock function returns just nothing.

```bash
 FAIL  src/add/stage1/add.test.ts
  mockConstructor
    ✕ 2 + 2 -> 4 (5 ms)

  ● mockConstructor › 2 + 2 -> 4

    expect(received).toBe(expected) // Object.is equality

    Expected: 4
    Received: undefined

       6 |     ${2} | ${2} | ${4}
       7 |   `('$a + $b -> $expected', ({ a, b, expected }) => {
    >  8 |     expect(add(a, b)).toBe(expected);
         |                       ^
       9 |   })
      10 | );
      11 |
```

### Stage 2. fix failing test

Now there is time to acctually create `add` function:

```ts
export const add = (a: number, b: number) => a + b;
```

That ends with a passing test.

```bash
 PASS  src/add/stage2/add.test.ts
  add
    ✓ 2 + 2 -> 4 (2 ms)
```

### Stage 3. add more tests

Adding more cases is the super trivial as well:

```ts
import { add } from './logic';

describe(add.name, () =>
  test.each`
    a      | b    | expected
    ${2}   | ${2} | ${4}
    ${-2}  | ${2} | ${0}
    ${999} | ${1} | ${1000}
  `('$a + $b -> $expected', ({ a, b, expected }) => {
    expect(add(a, b)).toBe(expected);
  })
);
```

which all passes

```zsh
 PASS  src/add/stage3/add.test.ts
  add
    ✓ 2 + 2 -> 4 (3 ms)
    ✓ -2 + 2 -> 0
    ✓ 999 + 1 -> 1000 (1 ms)
```

<!-- continue here -->

The string template table gives you many benefits

- is very readible as its is presented as auto formated table
- first row describing name of the arguments
- is very easy add or edit cases, just copy a line (auto format works like charm there)
<!-- AScII cinema for VSC ? -->
- it engorages you to created pure function, with atomic? arguments to keep this simplicity
- we have piece of documentation how our function works

But is that really worth it?

## Example 2. More advanced

Let's take a look at another not such obvious example:

Let's say we want we have `todo` app and want to calculate percentage of done tasks.

### Stage 1. initial empty function

So our empty function for now would be:

```ts
export const getDonePercent = (totalCount: number, doneCount: number) => undefined;
```

### Stage 2. initial failing test

Then we will cover it with test now:

```ts
describe(getDonePercent.name) {
  each`
  totalCount     | doneCount     | expected
  ${10}       | ${5}          | 50
  `
  getDonePercent(totalCount, doneCount).toBe(expected)
}
```

failing obviously

### Stage 3. test fix

and get it passed by adding function body:

```ts
export const getDonePercent = (totalCount: number, doneCount: number) => (doneCount / totalCount) * 100;
```

Super easy and ready to deploy once can say.
But the other will point dividing by 0 bug when our list is empty.

### Stage 4. add edgecase test

Let's test it by adding oneliner change:

```ts
describe(getDonePercent.name) {
  each`
  totalCount     | doneCount     | expected
  ${10}       | ${5}          | ${50}
  ${0}       | ${0}          | ?
  `
  getDonePercent(totalCount, doneCount).toBe(expected)
}
```

But wait. What we should return? 0% or maybe 100%. At this point unit test enforce us to create precise piece of specificaton by designing edgecase.
Onec can make different choice but for me result at this case is just undefined. And in that case we should show hide percentage for user.

```ts
describe(getDonePercent.name) {
  each`
  totalCount     | doneCount     | expected
  ${10}       | ${5}          | 50
  ${0}       | ${0}          | ${undefined}
  `
  getDonePercent(totalCount, doneCount).toBe(expected)
}
```

Now from that table you can get know how function will behave with that condition

test is failing at this ponit so let's fix it:

```ts
export const getDonePercent = (totalCount: number, doneCount: number) => {
  if (!totalCount) return undefined;

  return (done / totalCount) * 100;
};
```

### Stage 5. one more test

Are we ready for deployment now?

TDD encorages us to add more tests so let's check it out:

```ts
describe(getDonePercent.name) {
  each`
  totalCount     | doneCount     | expected
  ${10}       | ${5}          | 50
  ${0}       | ${0}          | ${undefined}
  ${999}       | ${5}          | 2
  `
  getDonePercent(totalCount, doneCount).toBe(expected)
}
```

Test are failing now, so with different result.

```
...console output
```

### Stage 6. one more test fix

Looks we have additional decimal that we don't want to have.

Let's fix it:

```ts
export const getDonePercent = (totalCount: number, doneCount: number) => {
  if (!totalCount) return undefined;

  return ((done / totalCount) * 100).toFixed(0);
};
```

### Stage 7. yet another one test

Let's add one more there is a strange result there `1.000000001` ?

As you can see, we've discovered and fixed quite a lot of edgecase with this function.

### Stage 8. yet another one test fix

### Stage 9. refactor

### Stage 10. make sure all tests still pass

...

## Summary

Unit testing of pure function can save us from fixig those quite large number of thiny bugs and provide nice documentation for created function at the same time.
It could save a lot of our time especially when our manual testing condition require muny clicks on app to reproduce some test conditions.

- build trust on code base
- discover interestnig edgecase that will help to define better user experience
- helps to keep better app structure: encourages to keep function small, pure, simply, readable, detatched from complex app structure
- provide to having tests that are fast and not fragile
- we discovered that trivial functions are not as trivial as they first seem

See some more sophisticated examples here
Want's more look at the example of file size Formating here.



Q:
But do we really need to test simple conditions?
What is the benefit of testing A & B & C? If you always know that it's true only when all of them are true?

A:
I think so because writing a test brings more benefits than just testing. When you use TDD approach, you creates better code automatically.

it isolates high business logic from implementation details.
that isolation / modularity will build proper dependencies which allows you to change business logic easily in future
it documents business logic which could be simple but it is important to understand what product is doing at the high level (it reflects communication between developers and product manages)
I think we shouldn't underestimate simple tests. If you take a look at testing pyramid (e2e, service, unit) you will notice that most of them should be unit. Why? because they are quick, do the job, are simple to write, to change and to understand. And boring :) which is good code smell as you don't need to "decode" complex logic but rather read it as a prose.



----
Q:
I agree, Yes, it can be encapsulated as implementation detail. But in this case it should not be allowed to broad use. Some other guy may have come and try to use this hook because it called useOrientationModules and it's available in package/hooks folder. Is it really fully reusable, though? Maybe give it more descriptive name, so it can't be misinterpreted.

I disagree, that hooks are flexible and composable enough to make every other function as hook. Just because hooks can't be put into a condition. This leads to optional arguments, return on the first line and etc. Which makes DX and code clarity drastically worth.

Like, why if my code module that requires sectionName to be executed properly can accept undefined? Is it correct from algorithmic stand point? Probably not, because function should not be called at all in this case. This is tradeoff that you had to use to wrap it into a hook.

What I want to say is that hooks are not panacea, and they should be used when they are really needed. You can do everything with simple functions (including encapsulation) as with hooks, but without tradeoffs. Only thing you can't do, is call a hook 😄 So I would prefer to compose functions inside a hook, than compose hooks, just because there is no way to compose them outside the hook or component.

My stand point is that all code that is offered for end developer as API should be truly reusable, because it's a pain when u start working on a ticket and spend 90% time tweaking code that was offered you to use. If it's only for particular case, it should be hidden from public api.

Feel free to argue :)

A:
useOrientationModules is not exposed, it is internal, take look at /hooks/index.ts
Dealing with null / undefined value is no more nightmare since TypeScript solved this 'The Billion Dollar Mistake' by guarding them semantically which doesn't exists in any other language
actually hooks has increased compositionality significantly since ever in React. Just plug and play.

Q:
useOrientationModules is not exposed, it is internal, take look at /hooks/index.ts

For me, most reliable way to encapsulate something from being exposed is to put it inside a folder of module within it is used. That way it visually obvious that it's implementation detail of a module. If it placed on the same level it means it is reusable somewhere else (hence open for usage).

Dealing with null / undefined value is no more nightmare

Typescript is not solving algorithmic issue. If required params for a function to execute properly not exist, function should not be called at first place.

actually hooks has increased compositionality significantly since ever in React. Just plug and play.

I didn't argued that. I said that hooks have limitations and they are not panacea. If something can be done with simple function, it should be done with simple function, because it don't have limitation that hooks have.

A:
At the end of the day most reliable is index file (do export or not), and we shouldn't forget about KISS (having additional folders for just one file is unnecessary)

Typescript do solve algorithmic issue by guarding optional chaining which you can use as a syntactic sugar instead of explicite logic. It basically do the same thing: stop the rest of algorithm execution when null is encountered. It's so handy, readable, condense, you can easily follow the logic being not spread through different places just for null checking. Its promote functional programming way of thinking that helps trust your code more.

I think the discussion has became out of sync for this PR because useOrientationModules.ts is removed as api was simplified.
