import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import axios from "api/axios";
import {
  GetMessageResponse,
  MessageLogsParams,
} from "api/reports/getReportLogs";
import { RootState } from "slices";

export const fetchMessageLogs = createAsyncThunk<
  GetMessageResponse, // Return type of the async action
  MessageLogsParams, // Payload type (all parameters)
  {
    state: RootState; // Type of the error value to be rejected with
  }
>(
  "messageLogs/fetchMessageLogs", // Action type prefix
  async (params, { rejectWithValue }) => {
    // Thunk handler function with payload
    try {
      // Make GET request to fetch message logs data
      const response = await axios.get<GetMessageResponse>(
        "v1/reports/export/conversation",
        { params },
      );

      // Return the response data
      return response.data;
    } catch (error) {
      // If an error occurs, reject the thunk with the error message
      return rejectWithValue("Failed to fetch message logs data");
    }
  },
);

//end of messagelog Thunk

interface MessageLogsState {
  data: GetMessageResponse | null;
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: MessageLogsState = {
  data: null,
  loading: false,
  error: null,
};

// Create a slice for managing message logs data
const messageLogsSlice = createSlice({
  name: "messageLogs",
  initialState,
  reducers: {
    // Additional reducers can be defined here if needed
  },
  extraReducers: builder => {
    builder
      // Handling the pending state while fetching data
      .addCase(fetchMessageLogs.pending, state => {
        state.loading = true;
        state.error = null;
      })
      // Handling the fulfilled state when data fetching is successful
      .addCase(fetchMessageLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      // Handling the rejected state when data fetching fails
      .addCase(fetchMessageLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export the reducer and actions

export default messageLogsSlice.reducer;
