import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import getReportLogs, {
  GetReportLogsResponse,
} from "api/reports/getReportLogs";
import { RootState } from "slices";
import { Report, ReportLogsState } from "types";
import handleAxiosError from "utils/handleAxiosError";

const DEFAULT_RECORDS_SIZE = 10;

const initialState: ReportLogsState = {
  loading: false,
  records: [],
  orderBy: "DESC",
  orderColumn: "createdAt",
  page: 1,
  size: DEFAULT_RECORDS_SIZE,
  totalCount: 0,
  totalPages: 1,
  selectedReport: null,
  mode: null,
};


export const getReportLogsAction = createAsyncThunk<
  GetReportLogsResponse,
  void | { page?: number; orderColumn?: "createdAt"; orderBy?: "ASC" | "DESC" },
  { state: RootState }
>(
  "reportLogs/getReportLogsAction",
  async (options, { rejectWithValue, getState }) => {
    try {
      const { page, size, orderColumn, orderBy } = getState().reportLogs;
      const order_column = options?.orderColumn || orderColumn;
      const order_by = options?.orderBy || orderBy;
      return await getReportLogs({
        page: options?.page || page,
        size,
        ...(order_column !== null ? { order_column } : {}),
        ...(order_by !== null ? { order_by } : {}),
      });
    } catch (err: any) {
      handleAxiosError(err);
      return rejectWithValue(new Error("Failed to fetch report logs"));
    }
  },
);

const reportLogs = createSlice({
  name: "reportLogs",
  initialState,
  reducers: {
    clearReportLogs: () => initialState,
    setSelectedReport: (state, action: PayloadAction<Report | null>) => {
      state.selectedReport = action.payload;
    },
    setReportMode: (state, action: PayloadAction<"MODAL" | "PANEL" | null>) => {
      state.mode = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getReportLogsAction.pending, state => {
      state.loading = true;
    });
    builder.addCase(getReportLogsAction.fulfilled, (state, action) => {
      const arg = action.meta.arg;
      state.loading = false;
      state.records = action.payload.records;
      state.page = action.payload.currentPage;
      state.totalCount = action.payload.totalCount;
      state.totalPages = action.payload.totalPages;
      if (arg?.orderColumn) state.orderColumn = arg.orderColumn;
      if (arg?.orderBy) state.orderBy = arg.orderBy;
    });
    builder.addCase(getReportLogsAction.rejected, state => {
      state.loading = false;
    });
  },
});

export const { clearReportLogs, setSelectedReport, setReportMode } =
  reportLogs.actions;

export default reportLogs.reducer;
