---
title: 'RxJs, Redux Observable, Redux Toolkit. Part 3 - scenarios'
date: '2021-06-23'
author: 'Wojciech Cendrzak'
image: '/images/rx-js-scenarios.png'
tags: 'React,TypeScript,RxJs'
isPublished: true
---

In this article, we’ll cover typical use cases of RxJs in React application.

We will gonna use a tech stack that we have got familiar with in previous articles: RxJs, Redux Toolkit, Redux-Observable

<!-- TODO -->

Note that this article is part of RxJs Series.

- [Part 1 - setup](/post/rxjs-redux-observable-redux-toolkit-part-1-setup)
- [Part 2 - boilerplate](/post/rxjs-redux-observable-redux-toolkit-part-2-boilerplate)

So let's get started.

## Typical Frontend Scenarios

RxJs offers a large number of operators or stream creators. However, for a typical React application, you will probably need a small set of them. Those operators would be **filter**, **map**, **throttleTime**, **mergeMap**, **switchMap**, **forkJoin** and **catchError**. As for stream creators, we gonna use: **from**, **of** and **fromEventPattern**. We will try to look at them closer to see how they can be useful for common React app needs.

1. Fetching from API
2. Fetching from API with cancel
3. Fetching in sequence
4. Fetching in parallel
5. Returning more than one value to the emitter
6. WebSocket listener
7. Avoid multiply button clicking
8. Live search optimization
9. Simple error handling
10. Bit advanced error handling

The complete source code you can see [here](https://github.com/WojciechCendrzak/react-redux-toolkit-rxjs-scenarios)

## 1. fetching from API

To start from, we will go with something simple.
We will try to fetch some product from API and store it in the redux store.

```ts
// app.epic.ts

export const fetchProduct$: RootEpic = (actions$, _, { api }) =>
  action$.pipe(
    filter(appSlice.actions.fetchProduct.match),
    map((action) => action.payload.id),
    mergeMap((id) => from(api.fetchProduct(id))),
    map((product) => appSlice.actions.setProduct({ product }))
  );
```

Let's break down this flow:

We have declared **fetchProduct$** epic, which takes redux **actions$** stream, ignores second parameter **\_** as a state stream because we don't need them, and destruct **api** from provided epic dependencies.

Then we are **piping** through every action in order to call operators in sequence for it.

First, we **filter** out actions other than **fetchProduct**. Notice that we have used here a **match** function provided by Redux Toolkit that returns boolean and at the same time **narrow action type** to a specific payload. That is so useful when using Typescript. We will also get propper type check on the following operator's inputs.

And here is the definition of this action:

```ts
// app.slice.ts

export const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    // ...
    fetchProduct: (_state, _action: PayloadAction<{ id: string }>) => {},
    setProduct: (state, action: PayloadAction<{ product: Product }>) => {
      const { product } = action.payload;
      state.producById[product.id] = product;
    },
    // ...
  },
});
```

Then we get and an **id** from an action payload using **map**

Then, most interestingly, we call **mergeMap** over internal short term observable created by **from** out of
**setProduct**, which was a **Promise**. But what is mergeMap itself?. There are some behaviors worth noticing here.

Based on the name of the operator, it will:

- take a **map** function that takes an outer observable action and returns a new inner observable
- **merge** all inner observables values into outer observable.

Speaking more precisely, it creates and subscribes to new internal observable.
Then it passes down all emitted values from all inner to outer observable.
In our case, we are creating an inner observable by using **from**.

How does it work in our real example?

Let's assume that we have a list of product cards with the basic information. And as a user, we want to expand each card to see more details by clicking on "see more" button. Users can click on multiply products in order to reveal all of them. So mergeMap will handle all the api calls and merge the results down to the outer observable.

The last one is **map** again. This time we take a result which is a product and return an action that will set it in store.

## 2. Fetching from API with cancel

Thanks for reading.
