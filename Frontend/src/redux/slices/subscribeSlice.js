import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//async thunk to create a checkout session
export const createSubscribe = createAsyncThunk(
  "subscribe/createSubscribe",
  async (Subscribedata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscribe`,
        Subscribedata,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const subscribeSlice = createSlice({
  name: "subscribe",
  initialState: {
    subscribe: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSubscribe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscribe.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribe = action.payload;
      })
      .addCase(createSubscribe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export default subscribeSlice.reducer
