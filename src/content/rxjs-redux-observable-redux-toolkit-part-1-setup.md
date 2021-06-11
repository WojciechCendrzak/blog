---
title: 'RxJs, Redux Observable, Redux Toolkit. Part 1 - setup'
date: '2021-06-09'
author: 'Wojciech Cendrzak'
image: '/images/rx-js-setup.png'
tags: 'React,TypeScript,RxJs'
isPublished: true
---

In this article, we will put together a simple React, ping pong application to show the idea of ​​reactivity.

This is the first in a series of articles about the RxJs, Redux Observable, Redux Toolkit:

- [Part 1 - setup](/post/rxjs-redux-observable-redux-toolkit-part-1-setup)
- [Part 2 - boilerplate](/post/rxjs-redux-observable-redux-toolkit-part-2-boilerplate)

So let's start:

## Bootstrap

First, we will initialize CRA application with TypeScript

```shell
yarn create react-app react-redux-toolkit-rxjs-setup --template typescript
```

Then we will add libraries

```shell
yarn add @reduxjs/toolkit react-redux rxjs redux-observable@2.0.0-rc.2
```

## Building block

Create a redux Toolkit slice

```ts
// app.slice.ts

import { createSlice } from '@reduxjs/toolkit';

export interface AppState {}

const initialState: AppState = {};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    ping: () => {},
    pong: () => {},
    endGame: () => {},
  },
});
```

Then we will create an Epic

```ts
// app.epic.ts

import { Action } from '@reduxjs/toolkit';
import { combineEpics, Epic } from 'redux-observable';
import { filter, map, tap } from 'rxjs/operators';
import { appSlice } from './app.slice';

export type RootEpic = Epic<Action, Action>;

const ping$: RootEpic = (action$) =>
  action$.pipe(
    filter(appSlice.actions.ping.match),
    tap(() => console.log('ping')),
    map(() => appSlice.actions.pong())
  );

const pong$: RootEpic = (action$) =>
  action$.pipe(
    filter(appSlice.actions.pong.match),
    tap(() => console.log('pong')),
    map(() => appSlice.actions.endGame())
  );

export const appEpic$ = combineEpics(ping$, pong$);
```

## Put it together

Create a store

```ts
// app.store.ts

import { Action } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import { configureStore } from '@reduxjs/toolkit';
import { appSlice } from './app.slice';
import { appEpic$ } from './app.epic';

const epicMiddleware = createEpicMiddleware<Action, Action>();

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
  middleware: [epicMiddleware],
});

epicMiddleware.run(appEpic$);
```

Provide a store

```ts
// index.tsx

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { App } from './app/app';
import { store } from './app/app.store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

## Fire action

Finally, let's dispatch a ping action

```ts
// app.tsx

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { appSlice } from './app.slice';

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appSlice.actions.ping());
  }, [dispatch]);

  return <div>Ping pong setup</div>;
};
```

In the console log you should see:

```shall
ping
pong
```

See complete code [here](https://github.com/WojciechCendrzak/react-redux-toolkit-rxjs-setup)

Thanks for reading.
