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

RxJs offers a large number of operators and stream creators. However, for a typical React application, you will probably need a small set of them. Those operators would be **filter**, **map**, **throttleTime**, **mergeMap**, **switchMap**, **forkJoin** and **catchError**. As for stream creators, we gonna use: **from**, **of** and **fromEventPattern**. We will try to look at them closely to see how they can be useful for common React app needs.

1. Fetching from API
2. Fetching from API with cancel
3. Calling API sequentially
4. Calling API parallelly
5. Emitting more than one action from epic
6. WebSocket listening
7. Avoiding multiply button click
8. Live search optimizing
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

## 3. Calling API sequentially

Let's take a look into a scenario where we want to fetch data one after the other. But, to make a second fetch, we need data from the previous one.

A real example could be like this: we try to log in a user into the server with its credentials.
After success, we will then take a user id from the response and fetch user details.

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

## 4. Calling API parallelly

Now we will try to call endpoint multiply times parallelly and collect all results at once.

A real example could be like that: upload multiple images to the server parallelly. Once all files have been uploaded put their urls in the store.

Here is the epic code:

```ts
// app.epic.ts

export const uploadPhotos$: RootEpic = (actions$, _, { api }) =>
  actions$.pipe(
    filter(appSlice.actions.uploadPhotos.match),
    map((action) => action.payload.files),
    switchMap((files) => forkJoin(files.map((file) => from(api.uploadPhoto(file))))),
    map((responses) =>
      appSlice.actions.setPhotos({
        photoUrls: responses.map((result) => result.url),
      })
    )
  );
```

And reducer cases:

```ts
// app.slice.ts

export const appSlice = createSlice({
  // ...
  reducers: {
    uploadPhotos: (_state, _action: PayloadAction<{ files: File[] }>) => {},
    setPhotos: (state, action: PayloadAction<{ photoUrls: string[] }>) => {
      state.photoUrls = action.payload.photoUrls;
    },
  },
});
```

As we can see, we used a **forkJoin**.

_"In parallel computing, the **fork–join model** is a way of setting up and executing parallel programs, such that execution branches off in parallel at designated points in the program, to **join** at a subsequent point and resume sequential execution"_

Let's break down the code line with **forkJoin**:

- first, we call a **map** through files and convert each file to observable.
- each observable is created by use **from** fed with API call (Promise).
- each observable is a short-lived stream that can return only one value and complete or throw an error.
- **forkJoin** is then fed with the observable list.
- **forkJoin** is waiting till all **observables** completes
- when all observables complete, emit the last emitted value from each.
- emitted result is an array of each call response with the same order as the initial files array

Finally, all responses array is mapped to urls array that **setPhotos** action require.

## 5. Emitting more than one action from epic

Up to now, all our epic emits one action as a result of one action incoming.
But what if we want to emit more than one action?

A real example could be that:

- user press logout button
- logout endpoint is called
- all the user data are removed from the store
- the user is navigated to the home page

Let's take a look at the solution:

```ts
// app.epic.ts

export const logout$: RootEpic = (actions$, _, { api }) =>
  actions$.pipe(
    filter(appSlice.actions.logout.match),
    switchMap(() => from(api.logout())),
    switchMap(() => of(appSlice.actions.reset(), appSlice.actions.navigateHome()))
  );
```

Again we used switchMap and fed it with observables of two redux actions created by **of** observable creator.

This time, whenever **logout** action is dispatched, two other actions: **reset** and **navigateHome** are emitted as epic output.

## 6. WebSocket listening

Now let's take a look at another scenario which is a **live chat**.
We want to show all incoming messages to our app through **WebSocket** and append it to a messages list.

Here is how code could be:

```ts
// app.epic.ts

export const startListeningFromWebSocket$: RootEpic = (actions$, _, { api }) =>
  actions$.pipe(
    filter(appSlice.actions.startListeningFromWebSocket.match),
    map(() => api.startWebSocketClient()),
    switchMap((webSocketClient) =>
      fromEventPattern<MessageEvent<string>>(
        (handler) => webSocketClient.addEventListener('message', handler),
        (handler) => webSocketClient.removeEventListener('message', handler)
      )
    ),
    map((event) => event.data),
    map((message) => appSlice.actions.appendMessage({ message }))
  );

// app.api.ts
export const api = {
  startWebSocketClient: () => new WebSocket(WEB_SOCKET_URL),
};
```

Let's break down:

- **startListeningFromWebSocket** action is dispatched and filtered here
- in **map** line, WebSocket client is created and pass down to the **switchMap**.
- **fromEventPattern** takes two parameters **addHandler** and **removeHandler**. Those are provided with WebSocket handlers accordingly.
- ones **fromEventPattern** is triggered, **addEventListener** is called and **fromEventPattern** starts emitting values down to outer observable as they comes from WebSocket client
- when **switchMap** inner observable is unsubscribed, **removeEventListener** is triggered
- last two maps gets a message from incoming WebSocket event and emits **appendMessage** action

## 7. Avoiding multiply button click

In lots of cases, we want to prevent **accidental multi-click**.

What's really cool about RxJs we can get this behavior in **one line only**!.

Let's add this line to the code we have before:

```ts
// app.epics.ts

export const loginThrottle$: RootEpic = (actions$, _, { api }) =>
  actions$.pipe(
    filter(appSlice.actions.login.match),
    throttleTime(250), // <---
    switchMap((action) => from(api.login(action.payload))),
    switchMap((response) => from(api.fetchUser(response.id))),
    map((user) => appSlice.actions.setUser({ user }))
  );
```

**throttleTime** emit first value then ignore for a specified duration. In our case, 250 milliseconds.

From now every accidental **multi-click** will become a **single click**.

## 8. Live search optimizing

Let's imagine input where a user can type a **search phrase**. While typing, results are adjusted **on the fly**. So far, so good. But when we use API endpoint to get results, we will generate a **lot of traffic**.

Here is a solution:

```ts
// app.epic.ts

export const searchProduct$: RootEpic = (actions$, _, { api }) =>
  actions$.pipe(
    filter(appSlice.actions.searchProduct.match),
    throttleTime(250, asyncScheduler, {
      leading: true,
      trailing: true,
    }),
    mergeMap((action) => from(api.searchProducts(action.payload.searchPhrase))),
    map((response) => appSlice.actions.setProducts({ products: response }))
  );
```

We used **throttleTime** again but now have some extra parameters: **leading** and **trailing** set to true. It means that:

- for the very first **searchProduct** action, API will be called (leading)
- after 250 milliseconds from the last **searchProduct** action, API will be called again (trailing). In that case, a **searchPhrase** will be taken from the last action payload.
- all actions in between will be skipped

## 9. Simple error handling

What's if an error occurs in our epic.
Let's say we tied to fetch a product from API, but we failed.

**catchError** operator comes to rescue.

```ts
// app.epic.ts

export const fetchProductWithSimpleErrorHandler$: RootEpic = (actions$, _, { api }) =>
  actions$.pipe(
    filter(appSlice.actions.fetchProduct.match),
    mergeMap((action) =>
      from(api.fetchProduct(action.payload.id)).pipe(
        // Placement 1. this will end only internal observable
        catchError((error: Error) => {
          console.log(`Error message: ${error.message}`);
          return EMPTY;
        })
      )
    ),
    map((product) => appSlice.actions.setProduct({ product })),
    // Placement 2. this will end outer observable (epic)
    catchError((error: Error) => {
      console.log(`Error message: ${error.message}`);
      return EMPTY;
    })
  );
```

### Placement in epic

Placement of **catchError** operator in epic is crucial.
Not matter whether the error was caught or not, it will **end the observable lifecycle** inside which it happened.

The second placement will then disable our epic for handling any further **fetchProduct** action.

So that is why we need to catch potential error inside the inner observable (first placement). When we call **fetchProduct** again, a new observable will be just created and live again.

### Alternative observable

**catchError** operator must return alternative observable that could be anything. For example, actions for navigating to Not Found page, etc. In our case, we return EMPTY observable, which emits nothing, and completes immediately.

## 10. Bit advanced error handling

In this scenario, we will create a new operator named **managed** to handle errors.
Here are assumptions:

- it will take one parameter, which is an operator we want to manage
- it will handle an error inside this new operator

In that assumptions, we have a couple of benefits:

- have a **central place** of catching errors
- **delegates** error handling to this new operator
- have main logic more **readable**.
- **reuse code**

Here is the code with managed operator:

```ts
// app.epic.ts

export const fetchProductManaged$: RootEpic = (actions$, _, { api }) =>
  actions$.pipe(
    filter(appSlice.actions.fetchProduct.match),
    managed(mergeMap((action) => from(api.fetchProduct(action.payload.id)))),
    map((product) => appSlice.actions.setProduct({ product }))
  );
```

And here is managed operator code itself:

```ts
export type Managed = <T, A>(operator: OperatorFunction<T, A>) => OperatorFunction<T, A>;

export const managed: Managed = (operator) =>
  mergeMap((action) =>
    of(action).pipe(
      operator,
      catchError((error: Error) => {
        console.log(error);
        return EMPTY;
      })
    )
  );
```

As you can see our new operator takes an operator we want to manage.
Then create an inner observable that could be safely ended when an error occurs.
Then we composed **managed operator** and **catchError** operators in pipe sequence.

Thanks for reading.
