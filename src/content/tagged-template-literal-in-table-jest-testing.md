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
