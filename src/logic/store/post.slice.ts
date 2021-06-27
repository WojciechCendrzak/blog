import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OutlineItem } from './outline.model';
import { getOutlineArray } from './post.logic';

export interface PostState {
  outlineByTitle: Record<string, OutlineItem>;
  outline?: OutlineItem[];
}

export const initialAppState: PostState = {
  outlineByTitle: {},
};

export const postSlice = createSlice({
  name: 'post',
  initialState: initialAppState,
  reducers: {
    reset: () => initialAppState,
    setOutlineItemReached: (state, action: PayloadAction<{ outlineItem: OutlineItem }>) => {
      const { outlineItem } = action.payload;
      state.outlineByTitle[outlineItem.title] = outlineItem;
      state.outline = getOutlineArray(state.outlineByTitle);
    },
  },
});
