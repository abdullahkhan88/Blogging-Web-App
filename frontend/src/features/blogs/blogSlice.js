import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//  Fetch all blogs
export const fetchBlogs = createAsyncThunk('blog/fetchBlogs', async (_, { rejectWithValue }) => {
  try {
    // 🔐 Get token from localStorage
    const token = sessionStorage.getItem('user_token');
    // 🔀 Call both APIs in parallel
    const [adminRes, userRes] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/admin/api/showblogs`),
      axios.get(`${import.meta.env.VITE_API_URL}/web/api/getUserApprovedBlog`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    //  Combine both blog arrays
    const combined = [...adminRes.data.data, ...userRes.data];

    //  Sort by latest
    combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Return to reducer
    return combined;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

/* export const fetchBlogs = createAsyncThunk('blog/fetchBlogs', async () => {
  const response = await axios.get('http://localhost:8000/admin/api/showblogs');
  return response.data.data;
}); */

//  Fetch all categories
export const fetchCategories = createAsyncThunk('blog/fetchCategories', async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/api/showCategory`);
  return response.data.data;
});

//  Like blog
export const likeBlog = createAsyncThunk('blog/likeBlog', async ({ blogId, token,usertype }) => {
  const response = await axios.put(
    `${import.meta.env.VITE_API_URL}/web/api/like/${blogId}`,
    {usertype},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.updatedBlog;
});

// dislike  slice

export const dislikeBlog = createAsyncThunk(
  'blog/dislikeBlog',
  async ({ blogId, token, usertype }, thunkAPI) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/web/api/dislikes/${blogId}`, {
        body:JSON.stringify({usertype}),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log(data)
      if (!res.ok) throw new Error(data.message || 'Dislike failed');
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    blogs: [],
    categories: [],
    filteredBlogs: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    filterByCategory: (state, action) => {
      const category = action.payload;
      if (category === 'All') {
        state.filteredBlogs = state.blogs;
      } else {
        state.filteredBlogs = state.blogs.filter(blog => blog.category === category);
      }
    },
  },
  extraReducers: builder => {
    builder
      //  Fetch Blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload;
        state.filteredBlogs = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      //  Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })

      //  Like Blog
      .addCase(likeBlog.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.blogs.findIndex(blog => blog._id === updated._id);
        if (index !== -1) {
          state.blogs[index] = updated;

          // Agar filtered list me bhi hai to wahan bhi update karo
          const filteredIndex = state.filteredBlogs.findIndex(blog => blog._id === updated._id);
          if (filteredIndex !== -1) {
            state.filteredBlogs[filteredIndex] = updated;
          }
        }
      });
  },
});

export const { filterByCategory } = blogSlice.actions;
export default blogSlice.reducer;
