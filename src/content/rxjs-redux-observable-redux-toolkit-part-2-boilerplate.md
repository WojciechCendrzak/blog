---
title: 'RxJs, Redux Observable, Redux Toolkit. Part 2 - boilerplate'
date: '2021-06-11'
author: 'Wojciech Cendrzak'
image: '/images/rx-js-boilerplate.png'
tags: 'React,TypeScript,RxJs'
isPublished: true
---

Wanna try more **RxJs** in your React application to deal with asynchronous code **effectively**? If yes, then you have come to the right place.

In this article, I will try to cover how to bootstrap a lean, robust boilerplate.

This is one in a series of articles about the RxJs, Redux Observable, Redux Toolkit:

- [Part 1 - setup](/post/rxjs-redux-observable-redux-toolkit-part-1-setup)
- [Part 2 - boilerplate](/post/rxjs-redux-observable-redux-toolkit-part-2-boilerplate)

## For who is this article?

I assumed that you have some knowledge about React, Redux, and TypeScript

## Goal

To begin with, let's define the goal we want to achieve:

- take advantage of **functional programming** to solve the complexity
- **decrease** the large **boilerplate**, that usual redux solution brings
- **keep refactoring easy** as the code base grows
- **trust in** yours code more,
- and most importantly, **keep fun** :)

## Working example

For this article, we will be creating a search for IT books. It will be a simple application with two pages. One with search bar and books result and second with books more details.
If you are more source code readers, you can find a complete solution [here](https://github.com/WojciechCendrzak/react-redux-toolkit-rxjs)

## Problem we gonna solve

**Redux** is one of the so well know and widely used libraries. However, among the many advantages, it has one significant drawback. A pretty **large boilerplate**. With all those _action types, action creators, mapStateToProps, high order components_, the **code loses its readability** and the possibility of **efficient refactoring**.

The solution in this article is more convenient.

So let start.

## Solution

Here are a main building block:

- [@reduxjs/toolkit](https://redux-toolkit.js.org/) - The official, toolset for Redux
- [RxJs](https://rxjs.dev/) - Reactive Extensions For JavaScript
- [redux-observable](https://redux-observable.js.org/) - RxJs-based middleware for Redux

These three libraries work well together. We will try to show it below.

## Redux Toolkit

If you have not used the redux toolkit yet, it is time to get started.
More than sure that if you try once, you will not want to come back.
It is [officialy recomemed](https://redux.js.org/), immutable by design, and uses redux behind anyway.
Combined with React hooks, it is a part that will significantly decrease a boilerplate.

#### Slice

The easiest way to create redux actions is through Slice.

But what is a **slice**?

_"... automatically generates action creators and action types that correspond to the reducers and state."_[check here](https://redux-toolkit.js.org/api/createSlice)

Isn't that cool?

Let's take a closer look at how our **Slice** is defined:

```ts
// book.slice.ts

export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    setSearchPhrase: (state, action: PayloadAction<{ searchPhrase: string }>) => {
      state.searchPhrase = action.payload.searchPhrase;
    },
    fetchBooks: () => undefined,
    setBooks: (state, action: PayloadAction<{ books: Book[] }>) => {
      state.books = action.payload.books;
    },
    // ...
  },
});

// reducer state definition
export interface BookState {
  searchPhrase?: string;
  books?: Book[];
}

const initialState: BookState = {};
```

As we can see **createSlice** contains some configuration:

- we have a **name**, used in generated action types
- the **initialState** for the reducer
- **reducers** object of _case reducers_ and redux action at the same time!
- action could take parameters like **setSearchPhrase** and have a case reducer body. What interesting Redux Toolkit uses [immer](https://www.npmjs.com/package/immer) internally automatically. So, you don't need to create a new state but only _mutate_ it
- some actions could be parameterless and bodiless like **fetchBooks**. We gonna use it only to trigger async logic in **Epic**

## RxJs

_“compose asynchronous and event-based programs by using observable sequence”_

**Functional programming** is becoming more and more popular nowadays.
It is much more different from imperative language.
Therefore, the **learning curve is a bit steep**.
However, if you cross a certain threshold, you will not want to come back.

**RxJs** It is sometimes called **lodash for stream**.

## Redux Observable

It is a middleware for handling asynchronous operations from a sent action.

There are a couple of things it does:

- emits dispatched redux action into action stream
- introduce **Epic** as a piece of RxJs
- feed Epic with redux action stream and take action stream
- subscribe to all Epics,

#### Epic

As the documentation says:

_"It is a function that takes a stream of actions and returns a stream of actions."_

With a **pipe** function, you can process single action through any number of operators.

Especially we will use Epic for:

- keep **business logic** / **user story** in one declarative flow,
- decouple logic from view by **call and forget** approach
- keep trust our code by **function composition** and great **type flow**

Here is an example:

```ts
// book.epic.ts

const fetchBooks$: RootEpic = (action$, state$) =>
  action$.pipe(
    filter(bookSlice.actions.fetchBooks.match),
    throttleTime(250),
    map(() => getSearchPhrase(state$.value)),
    switchMap((searchPhrase) => from(bookApi.fetchBooks(searchPhrase))),
    map((result) => bookSlice.actions.setBooks({ books: result.books }))
  );
```

Let's go through it step by step

**fetchBooks$** epic is a function that takes **action$** as actions stream.
"$" at the end is just a naming convention to indicate we are dealing with streams).

It also takes **state$** as a stream from which we can select some value later on.

Then we have a **pipe** that lets us **compose** operators in a sequence.

**Operators** work on a single value emitted to the stream.
The output of one operator is fed into the next operator as input.
The first operator in epic always takes a redux action. The last must return redux action.

Then we have a couple of operators:

#### filter operator

When action is dispatched, all epis are called.

All epics will be triggered after dispatching an action.
Typically we want to call specific logic for single action only.
Redux Toolkit provides a **match** function for all actions. Moreover, it implements **type guard** of TypeScript. So the following operator will get action with a specific payload as was defined in Slice. So we can take benefit of a **one-time cost** action definition. That could help us at refactoring time.

Isn't it awesome?

#### throttleTime operator

We want to trigger a search as we type a search phrase. However, it will produce too many API calls.
This **one-liner** will skip all but one action every 250 milliseconds.

What a great declarative approach!

#### map operator

It's pretty straightforward.
We take a search phrase from the selector **getSearchPhrase**.

Here is how it is defined:

```ts
export const getSearchPhrase = (store: StoreState) => store.book.searchPhrase || '';
```

#### switchMap operator

Here is the part that calls API.

The function **from** creates an internal stream out of **Promise**.
On success, it will emit a response data of API call to that stream.

What switchMap does is to take that stream and flatten it into an upper stream.

#### map operator again

Finally, the last map will take a response object and return an action (as required by Epic) to set books in the reducer.

Then, an Epic will dispatch this action.

## Close the Redux cycle

In a search form, we can trigger a book fetching by dispatching a **fetchBooks** action.
It's helped us to decouple logic from view by **call and forget** approach.

```ts
// search-form.tsx

export const SearchForm: React.FC = () => {
  const dispatch = useDispatch();

  const handleSearch = useCallback(() => {
    dispatch(bookSlice.actions.fetchBooks());
  }, [dispatch]);

  // ...
```

Then we can show the search results in the list just by selecting them from the store state.

```ts
// book-cards.tsx

export const BookCards: React.FC = () => {
  const bookCards = useSelector(getBookCards);

  return (
    <>
      <Title>{translate(translationKeys.common.searchForm.title)}</Title>
      {bookCards?.map((bookCard, index) => (
        <BookCard key={index} book={bookCard} />
      ))}
    </>
  );
};
```

```ts
// book.selector.ts

export const getBookCards = (store: StoreState) => store.book.books;
```

```ts
// app.reducers.ts

export interface StoreState {
  book: BookState;
}

export const reducers = {
  book: bookSlice.reducer,
};
```

See complete solution code [here](https://github.com/WojciechCendrzak/react-redux-toolkit-rxjs)

## Sum up

- we took benefits of **functional programming**. Especially a composition as a great concept for solving the **complexity** grows.
- we have **decreased** the large **boilerplate**, that usual redux solution brings
- with TypeScript, ReduxToolkit and lose coupling **keep refactoring easy** as the code base grows
- with great type flow in Epics we obtain more code **quality** and more **trust** in our code,
- we keep **business logic** in one place,
- we express business logic in a declarative way so we can reflect better a **user story**

- and most importantly **have fun** hopefully, :)

Thanks for reading.
