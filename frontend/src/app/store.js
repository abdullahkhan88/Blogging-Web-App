import { configureStore } from '@reduxjs/toolkit';
import blogReducer from '../features/blogs/blogSlice';
import authReducer from '../features/Authentication/AuthSlice';
import commentsReducer from  '../features/comment/commentSlice';

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    auth: authReducer,
    comments: commentsReducer,
  },
});
