import { StoreState } from '../../app/app.store';

export const getIsOutlineItemReached = (title: string) => (store: StoreState) => store.post.outlineByTitle[title];
export const getIsOutline = (store: StoreState) => store.post.outline;
