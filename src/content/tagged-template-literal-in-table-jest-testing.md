---
title: 'Jest testing - Tagged Template Literal in table testing'
date: '2022-07-11'
author: 'Wojciech Cendrzak'
image: '/images/tagged-template-literal-jest-test.png'
tags: 'TDD, jest, TypeScript, nodejs'
isPublished: true
---

Have you ever implemented **simple logic** that, though it looked very trivial at first glance, was actually **buggy**?

Omitted parenthesis, wrong operator or simply not all edge cases covered?
Then, have been running an application, again and again, only to discover yet another fault?
Or even worse, have to wait a while for CD have been completed, follow complicated reproduction steps just to notice yet another one?

Is there a better way to play this **game of cat and mouse.**

This article is about solving all those issues. It will significantly increase trust in a logic you've created!

We gonna use a **T**est **D**riven **D**evelopment with jest `Tagged Template Literal` approach.

`jest` is a widely known testing solution.
It offers `string template approach`, rather merely recognized but definitely underprices.

## Tagged Template Literal

Shortly speaking, it allows you to create one test to handle many different testing cases.
It makes a test more condensed but more readable and easy to change at one time.
This also makes it easy to add a new edge case or edit an existing one.

See more [here](https://jestjs.io/docs/api#2-testeachtablename-fn-timeout)

## Test Driven Development

We will be using TDD along the `table jest testing` because those both approaches fits together incredibly well.

Let's warm up first with a very trivial example in the TDD way, which stands for:

1. create a test with only one case (test will fail)
2. create a function with simply implementation (to fulfill the test)
3. add more test cases and modify the function to satisfy it if needed
4. refactor function to increase performance or readability if needed
5. run the test to check whether new changes didn't break anything

## Example 1: warming up

Let's add some numbers.
Who don't like to add numbers?

All source code you can find [here](https://github.com/WojciechCendrzak/tagged-emplate-iteral-jest-tests).

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

which all passes successfully now

```bash
 PASS  src/add/stage3/add.test.ts
  add
    ✓ 2 + 2 -> 4 (3 ms)
    ✓ -2 + 2 -> 0
    ✓ 999 + 1 -> 1000 (1 ms)
```

The _string template table_ gives you many benefits

- you have only one test for many test cases (no code duplication)
- test cases becomes very clear when case data are presented as a row of table
- first row describes name of the arguments so you have an instant understanding of what test data are
- is very easy to add cases, just copy a line (auto format works like charm there)

But is that really worth it?

## Example 2. Simply example with pitfall

Let's take a look for another, that looks equally simply but contains some common pitfalls that java script developers often falls into.

Let's say we want to calculate percentage of tasks done in our hypothetical todo app.

### Stage 1. create a test

Let's create a test first that falls:

```ts
const getPercent = jest.fn();

describe(getPercent.name, () =>
  test.each`
    done | total | expected
    ${5} | ${10} | ${50}
  `('$done done of total $total should give $expected %', ({ done, total, expected }) => {
    expect(getPercent(done, total)).toBe(expected);
  })
);
```

### Stage 2. simple implementation

Now implement a function to fulfill the test:

```ts
export const getPercent = (doneCount: number, totalCount: number) => (doneCount / totalCount) * 100;
```

### Stage 3. add edge case

Ready to deploy once can say.
But the other will point dividing by 0 bug when our list is empty.

Let's test it by adding one liner change:

```ts
describe(getPercent.name, () =>
  test.each`
    done | total | expected
    ${5} | ${10} | ${50}
    ${0} | ${0}  | ${'???'}
  `('$done done of total $total should give $expected %', ({ done, total, expected }) => {
    expect(getPercent(done, total)).toBe(expected);
  })
);
```

But wait. What we should return? 0%, 100% or undefined? As you can see we need to make a decision here.
I've chosen undefined for now.

```ts
describe(getPercent.name, () =>
  test.each`
    done | total | expected
    ${5} | ${10} | ${50}
    ${0} | ${0}  | ${undefined}
  `('$done done of total $total should give $expected %', ({ done, total, expected }) => {
    expect(getPercent(done, total)).toBe(expected);
  })
);
```

By doing that we have just made a piece of **documentation** to our function.

So let's fix a falling test now.

```ts
export const getPercent = (doneCount: number, totalCount: number) => {
  if (!totalCount) return undefined;

  return (doneCount / totalCount) * 100;
};
```

Are we ready for deployment now?

TDD encourages us to add more tests so let's check it out:

<!-- continue here -->

### Stage 4. one more test

```ts
describe(getPercent.name, () =>
  test.each`
    done | total | expected
    ${5} | ${10} | ${50}
    ${0} | ${0}  | ${undefined}
    ${5} | ${99} | ${5}
  `('$done done of total $total should give $expected %', ({ done, total, expected }) => {
    expect(getPercent(done, total)).toBe(expected);
  })
);
```

Test are failing now, so with different result.

```bash
 FAIL  src/get-percent1/stage4/get-percent.test.ts
  getPercent
    ✓ 5 done of total 10 should give 50 % (3 ms)
    ✓ 0 done of total 0 should give undefined %
    ✕ 5 done of total 99 should give 5 % (3 ms)

  ● getPercent › 5 done of total 99 should give 5 %

    expect(received).toBe(expected) // Object.is equality

    Expected: 5
    Received: 5.05050505050505

      10 |     '$done done of total $total should give $expected %',
      11 |     ({ done, total, expected }) => {
    > 12 |       expect(getPercent(done, total)).toBe(expected);
         |                                       ^
      13 |     }
      14 |   )
      15 | );
```

Looks we have additional decimal that we don't.

Let's fix it:

```ts
export const getPercent = (doneCount: number, totalCount: number) => {
  if (!totalCount) return undefined;

  return Math.round((doneCount / totalCount) * 100);
};
```

Not bad, we've just fixed a potential bug with strange numbers on the screen.
Let's explore more. Appetite grows with eating.

### Stage 6. refactor

Let's say we want to present percentage with some decimal numbers this time.

So refactor our test first:

```ts
describe(getPercent.name, () =>
  test.each`
    done | total | fractionDigits | expected
    ${5} | ${10} | ${0}           | ${'50'}
    ${0} | ${0}  | ${0}           | ${undefined}
    ${5} | ${99} | ${0}           | ${'5'}
    ${5} | ${10} | ${2}           | ${'50.00'}
    ${3} | ${9}  | ${2}           | ${'33.33'}
  `('$done done of total $total should give $expected %', ({ done, total, fractionDigits, expected }) => {
    expect(getPercent(done, total, fractionDigits)).toBe(expected);
  })
);
```

And our final implementation will looks like:

```ts
export const getPercent = (doneCount: number, totalCount: number, fractionDigits: number) => {
  if (!totalCount) return undefined;

  return ((doneCount / totalCount) * 100).toFixed(fractionDigits);
};
```

By running tests we can make sure all our changes still works like intended.

## Summary

Table testing of jest provides a very clean way to test multiple cases by having a single test. That also provide a nice way of documenting our function.
It could save a lot of our time especially when our manual testing condition require many clicks on app to get into required test conditions.
