import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.ts';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Types for usage in your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
