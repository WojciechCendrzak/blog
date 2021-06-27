import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { postSlice } from '../logic/store/post.slice';

export const makeStore = () =>
  configureStore({
    reducer: {
      [postSlice.name]: postSlice.reducer,
    },
  });

export type Store = ReturnType<typeof makeStore>;
export type StoreState = ReturnType<Store['getState']>;

export const wrapper = createWrapper<Store>(makeStore);
