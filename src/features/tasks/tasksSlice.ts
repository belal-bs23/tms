import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import { addNewTask, fetchTasks, updateTask, deleteTask } from "./tasksAPI";
import type { AddNewTaskData, UpdateTaskData } from "./tasksAPI";

export type Member = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  memberId?: number;
  Member?: Member;
  userId: number;
  createdAt: string;
  updatedAt: string;
  status: "idle" | "loading" | "failed" | "succeeded" | "deleting" | "deleted";
  error: any;
  requiredReload: boolean;
};

export interface TaskState {
  status: "idle" | "loading" | "failed" | "succeeded";
  error: any;
  extras: {
    add: {
      status:
        | "idle"
        | "loading"
        | "failed"
        | "succeeded"
        | "creating"
        | "created"
        | "deleting"
        | "deleted";
      error: any;
    };
  };
  requiredReload: boolean;
}

const initialState: TaskState = {
  status: "idle",
  error: null,
  extras: {
    add: {
      status: "idle",
      error: null,
    },
  },
  requiredReload: true,
};

export const fetchTasksAsync = createAsyncThunk(
  "tasks/fetchTasks",
  async () => {
    const response = await fetchTasks();
    return response.tasks;
  }
);

export const addNewTaskAsync = createAsyncThunk(
  "tasks/addNewTask",
  async (data: AddNewTaskData) => {
    const response = await addNewTask(data);
    return response;
  }
);

export const updateTaskAsync = createAsyncThunk(
  "tasks/updateTask",
  async (param: { id: number; data: UpdateTaskData }) => {
    const { id, data } = param;
    const response = await updateTask(id, data);
    return response;
  }
);

export const deleteTaskAsync = createAsyncThunk(
  "tasks/deleteTask",
  async (param: { id: number }) => {
    const { id } = param;
    await deleteTask(id);
  }
);

const tasksAdapter = createEntityAdapter<Task>({
  selectId: (task) => task.id,
  sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt),
});

export const {
  selectAll: selectAllTasks,
  selectIds: selectTaskIds,
  selectById: selectTaskById,
} = tasksAdapter.getSelectors((state: RootState) => state.tasks);

export const selectTaskStatusById = (state: RootState, taskId: number) => {
  const task = selectTaskById(state, taskId);
  return task?.status;
};

export const selectTaskErrorById = (state: RootState, taskId: number) => {
  const task = selectTaskById(state, taskId);
  return task?.error;
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState: tasksAdapter.getInitialState(initialState),
  reducers: {
    resetAddTaskState(state) {
      state.extras.add.status = "idle";
      state.extras.add.error = null;
    },
    resetTasksExtras(state) {
      state.extras.add.status = "idle";
      state.extras.add.error = null;
    },
    tasksCleared: tasksAdapter.removeAll,
    resetTasksState(state) {
      if (state.status !== "idle") state.status = "idle";
      if (state.error !== null) state.error = null;
    },
    resetTaskStateById(state, action: PayloadAction<number>) {
      const taskId = action.payload;
      tasksAdapter.updateOne(state, {
        id: taskId,
        changes: { status: "idle", error: null },
      });
    },
    resetTaskRequiredReloadById(state, action: PayloadAction<number>) {
      const taskId = action.payload;
      tasksAdapter.updateOne(state, {
        id: taskId,
        changes: { requiredReload: false },
      });
    },
    setTasksRequiredReload(state, action) {
      state.requiredReload = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTasksAsync.fulfilled, (state, action) => {
        tasksAdapter.upsertMany(state, action);
        state.status = "succeeded";
        state.requiredReload = false;
      })
      .addCase(fetchTasksAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewTaskAsync.pending, (state) => {
        state.extras.add.status = "creating";
        state.extras.add.error = null;
      })
      .addCase(addNewTaskAsync.fulfilled, (state, action) => {
        state.extras.add.status = "created";
        state.requiredReload = true;
      })
      .addCase(addNewTaskAsync.rejected, (state, action) => {
        state.extras.add.status = "failed";
        state.extras.add.error = action.error.message;
      })
      .addCase(updateTaskAsync.pending, (state, action) => {
        const id = action.meta.arg.id;
        tasksAdapter.updateOne(state, {
          id,
          changes: {
            status: "loading",
            error: null,
          },
        });
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        const id = action.meta.arg.id;
        tasksAdapter.updateOne(state, {
          id,
          changes: {
            status: "succeeded",
            error: null,
            requiredReload: true,
          },
        });
        state.requiredReload = true;
      })
      .addCase(updateTaskAsync.rejected, (state, action) => {
        const id = action.meta.arg.id;
        tasksAdapter.updateOne(state, {
          id,
          changes: {
            status: "failed",
            error: action.error.message,
          },
        });
      })
      .addCase(deleteTaskAsync.pending, (state, action) => {
        const id = action.meta.arg.id;
        tasksAdapter.updateOne(state, {
          id,
          changes: {
            status: "deleting",
            error: null,
          },
        });
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        const id = action.meta.arg.id;
        tasksAdapter.updateOne(state, {
          id,
          changes: {
            status: "deleted",
            error: null,
          },
        });
        // tasksAdapter.removeOne(state, id); // this line cause the problem
        state.requiredReload = true;
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        const id = action.meta.arg.id;
        tasksAdapter.updateOne(state, {
          id,
          changes: {
            status: "failed",
            error: action.error.message,
          },
        });
      });
  },
});

export const selectTasksRequiredReload = (state: RootState) =>
  state.tasks.requiredReload;
export const selectTasksStatus = (state: RootState) => state.tasks.status;
export const selectTasksError = (state: RootState) => state.tasks.error;
export const selectTasksStatusLoading = (state: RootState) =>
  Boolean(state.tasks.status === "loading");
export const selectTasksStatusSucceeded = (state: RootState) =>
  Boolean(state.tasks.status === "succeeded");

export const selectTasksExtras = (state: RootState) => state.tasks.extras;
export const selectTasksExtrasAddStatus = (state: RootState) =>
  state.tasks.extras.add.status;
export const selectTasksExtrasAddError = (state: RootState) =>
  state.tasks.extras.add.error;

export const selectTaskIdsByMemberId = (state: RootState, memberId: number) => {
  const tasks = selectAllTasks(state);
  const initialTaskIds: number[] = [];
  const taskIds = tasks.reduce((pre, cur) => {
    if (cur.memberId === memberId) pre.push(cur.id);
    return pre;
  }, initialTaskIds);
  return taskIds;
};

export const selectNumberOfTasksByMemberId = (
  state: RootState,
  memberId: number
) => {
  const tasks = selectAllTasks(state);
  let initialCount = 0;
  const numberOfTasks = tasks.reduce((pre, cur) => {
    if (cur.memberId === memberId) pre++;
    return pre;
  }, initialCount);
  return numberOfTasks;
};

export const {
  resetAddTaskState,
  resetTasksExtras,
  tasksCleared,
  resetTasksState,
  resetTaskStateById,
  resetTaskRequiredReloadById,
  setTasksRequiredReload,
} = tasksSlice.actions;

export const reloadAllTasks = (): AppThunk => async (dispatch, getState) => {
  dispatch(resetTasksState());
  dispatch(resetTasksExtras());
  dispatch(tasksCleared());
  dispatch(fetchTasksAsync());
};

export const resetTasks = (): AppThunk => async (dispatch, getState) => {
  dispatch(resetTasksState());
  dispatch(resetTasksExtras());
  dispatch(tasksCleared());
  // dispatch(setTasksRequiredReload());
};

export default tasksSlice.reducer;
