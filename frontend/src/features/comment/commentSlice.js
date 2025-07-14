import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 1️ User: Get Approved Comments by Blog ID
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (blogId, thunkAPI) => {
    try {
      const token = sessionStorage.getItem('user_token'); // ya sessionStorage.getItem() if you're using that

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/web/api/fetchComment/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return res.data.comments;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// 2️ User: Post a Comment
export const postComment = createAsyncThunk(
  'comments/postComment',
  async ({ blogId, text, token }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/web/api/comment`,
      { blogId, text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.comment;
  }
);

// User: Delete a Comment
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ commentId, token }, thunkAPI) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/web/api/deleteComment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return commentId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

//  Admin: Fetch Pending Comments
export const fetchPendingComments = createAsyncThunk(
  'comments/fetchPendingComments',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/api/pendingComments`);
      return res.data.comments;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

//  Admin: Approve a Comment
export const approveComment = createAsyncThunk(
  'comments/approveComment',
  async ({ commentId, token }, thunkAPI) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/api/approveComment/${commentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return res.data.comment;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Slice
const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],         // Approved comments (user)
    pendingComments: [],  // Pending comments (admin)
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //  Fetch Approved Comments
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      //  Post a Comment
      .addCase(postComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })

      //  Delete a Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(c => c._id !== action.payload);
      })

      //  Admin: Fetch Pending Comments
      .addCase(fetchPendingComments.fulfilled, (state, action) => {
        state.pendingComments = action.payload;
      })

      //  Admin: Approve a Comment
      .addCase(approveComment.pending, (state) => {
        state.status = "loading"; // Show loading when approving
      })
      .addCase(approveComment.fulfilled, (state, action) => {
        state.status = "succeeded"; // After success
        state.pendingComments = state.pendingComments.filter(
          (comment) => comment._id !== action.payload._id
        );
        state.comments.push(action.payload); // Optional: add to approved comments
      })
      .addCase(approveComment.rejected, (state, action) => {
        state.status = "failed"; // If error
        state.error = action.payload;
      });
  }
});

export default commentsSlice.reducer;
