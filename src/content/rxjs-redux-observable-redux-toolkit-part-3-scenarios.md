---
title: 'RxJs, Redux Observable, Redux Toolkit. Part 3 - scenarios'
date: '2021-06-23'
author: 'Wojciech Cendrzak'
image: '/images/rx-js-scenarios.png'
tags: 'React,TypeScript,RxJs'
isPublished: true
includeReferences: rxjs-redux-observable-redux-toolkit-series-section
---

In this article, we’ll cover typical use cases of RxJs in React application.

We will gonna use a tech stack that we have got familiar with in previous articles: RxJs, Redux Toolkit, Redux-Observable

{{rxjs-redux-observable-redux-toolkit-series-section}}

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

This time let's say we have the same product list as before. But now there would be one separate place to show details of the selected product. The user can click on several product cards one after the other. However, we want to see only the last selected.

There is typically no guarantee that API will respond with the same order as was requested.
It could cause a subtle error. We could see a product that we did not choose last.

To solve this, we will use the **switchMap** operator this time.

Let's look at the code:

```ts
// app.epic.ts

export const fetchSelectedProduct$: RootEpic = (actions$, _, { api }) =>
  actions$.pipe(
    filter(appSlice.actions.fetchSelectedProduct.match),
    map((action) => action.payload.id),
    switchMap((id) => from(api.fetchProduct(id))),
    map((product) => appSlice.actions.setSelectedProduct({ product }))
  );
```

Apart from different action names, the only difference with the previous code is that we have used **switchMap** instead of **mergeMap**.
And we have obtained **cancelation** just like this! Isn't awesome?

But how **switchMap** is working then?

Based on the name of the operator, it will:

- take a **map** function that takes an outer observable action and returns a new inner observable
- **switch** from the previous inner observable to this new, and propagate all its values to the outer observable.

Speaking more precisely, it creates and subscribes to new internal observable.
But compared to **mergeMap**, it unsubscribes from previous subscribed inner observable first. So all values emitted by all previous inner observables are just forgotten. Which means, **canceled**.

## 3. Fetching in sequence

Let's take a look into a scenario where we want to fetch data one after the other. But, to make a second fetch, we need data from the previous one.

A real example could be like this: we try to login to the server with its credentials. Once it was done, we gonna take a user id from the response and fetch user details.

Code would be like that:

```ts
// app.epic.ts

export const login$: RootEpic = (actions$, _, { api }) =>
  actions$.pipe(
    filter(appSlice.actions.login.match),
    switchMap((action) => from(api.login(action.payload))),
    switchMap((response) => from(api.fetchUser(response.id))),
    map((user) => appSlice.actions.setUser({ user }))
  );
```

And our action are defined like this:

```ts
// app.slice.ts

export const appSlice = createSlice({
  // ...
  reducers: {
    login: (_state, _action: PayloadAction<{ login: string; password: string }>) => {},
    fetchUser: (_state, _action: PayloadAction<{ id: string }>) => {},
    setUser: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
    },
  },
});
```

As you can see, we have used **switchMap** twice.
Does it mean fetching in sequence? Yes.
Till the first fetching is unfinished, the first **switchMap** will emit nothing. And it causes the second one to wait.

Marvelous.

Ones first one emits result, in this case, data containing user **id**, the second will notice this and play its role. Finally, user details are placed in the store by emitted action **setUser**

## 4. Fetching in parallel

... to be continued

Thanks for reading.
