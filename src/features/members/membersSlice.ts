import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import {
  addNewMember,
  fetchMembers,
  updateMember,
  deleteMember,
} from "./membersAPI";
import type { AddNewMemberData, UpdateMemberData } from "./membersAPI";

type Member = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  status: "idle" | "loading" | "failed" | "succeeded" | "deleting" | "deleted";
  error: any;
  requiredReload: boolean;
};

export interface MemberState {
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

const initialState: MemberState = {
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

export const fetchMembersAsync = createAsyncThunk(
  "members/fetchMembers",
  async () => {
    const response = await fetchMembers();
    return response.data;
  }
);

export const addNewMemberAsync = createAsyncThunk(
  "members/addNewMember",
  async (data: AddNewMemberData) => {
    const response = await addNewMember(data);
    return response.data;
  }
);

export const updateMemberAsync = createAsyncThunk(
  "members/updateMember",
  async (param: { id: number; data: UpdateMemberData }) => {
    const { id, data } = param;
    const response = await updateMember(id, data);
    return response.data;
  }
);

export const deleteMemberAsync = createAsyncThunk(
  "members/deleteMember",
  async (param: { id: number }) => {
    const { id } = param;
    await deleteMember(id);
  }
);

const membersAdapter = createEntityAdapter<Member>({
  selectId: (member) => member.id,
  sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt),
});

export const {
  selectAll: selectAllMembers,
  selectIds: selectMemberIds,
  selectById: selectMemberById,
} = membersAdapter.getSelectors((state: RootState) => state.members);

export const selectMemberStatusById = (state: RootState, memberId: number) => {
  const member = selectMemberById(state, memberId);
  return member?.status;
};

export const selectMemberErrorById = (state: RootState, memberId: number) => {
  const member = selectMemberById(state, memberId);
  return member?.error;
};

const membersSlice = createSlice({
  name: "members",
  initialState: membersAdapter.getInitialState(initialState),
  reducers: {
    resetAddMemberState(state) {
      state.extras.add.status = "idle";
      state.extras.add.error = null;
    },
    resetMembersExtras(state) {
      state.extras.add.status = "idle";
      state.extras.add.error = null;
    },
    membersCleared: membersAdapter.removeAll,
    resetMembersState(state) {
      if (state.status !== "idle") state.status = "idle";
      if (state.error !== null) state.error = null;
    },
    resetMemberStateById(state, action: PayloadAction<number>) {
      const memberId = action.payload;
      membersAdapter.updateOne(state, {
        id: memberId,
        changes: { status: "idle", error: null },
      });
    },
    resetMemberRequiredReloadById(state, action: PayloadAction<number>) {
      const memberId = action.payload;
      membersAdapter.updateOne(state, {
        id: memberId,
        changes: { requiredReload: false },
      });
    },
    setMembersRequiredReload(state, action) {
      state.requiredReload = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembersAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMembersAsync.fulfilled, (state, action) => {
        membersAdapter.upsertMany(state, action);
        state.status = "succeeded";
        state.requiredReload = false;
      })
      .addCase(fetchMembersAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewMemberAsync.pending, (state) => {
        state.extras.add.status = "creating";
        state.extras.add.error = null;
      })
      .addCase(addNewMemberAsync.fulfilled, (state, action) => {
        state.extras.add.status = "created";
        state.requiredReload = true;
      })
      .addCase(addNewMemberAsync.rejected, (state, action) => {
        state.extras.add.status = "failed";
        state.extras.add.error = action.error.message;
      })
      .addCase(updateMemberAsync.pending, (state, action) => {
        const id = action.meta.arg.id;
        membersAdapter.updateOne(state, {
          id,
          changes: {
            status: "loading",
            error: null,
          },
        });
      })
      .addCase(updateMemberAsync.fulfilled, (state, action) => {
        const id = action.meta.arg.id;
        membersAdapter.updateOne(state, {
          id,
          changes: {
            status: "succeeded",
            error: null,
            requiredReload: true,
          },
        });
        state.requiredReload = true;
      })
      .addCase(updateMemberAsync.rejected, (state, action) => {
        const id = action.meta.arg.id;
        membersAdapter.updateOne(state, {
          id,
          changes: {
            status: "failed",
            error: action.error.message,
          },
        });
      })
      .addCase(deleteMemberAsync.pending, (state, action) => {
        const id = action.meta.arg.id;
        membersAdapter.updateOne(state, {
          id,
          changes: {
            status: "deleting",
            error: null,
          },
        });
      })
      .addCase(deleteMemberAsync.fulfilled, (state, action) => {
        const id = action.meta.arg.id;
        membersAdapter.updateOne(state, {
          id,
          changes: {
            status: "deleted",
            error: null,
          },
        });
        // membersAdapter.removeOne(state, id); // this line cause the problem
        state.requiredReload = true;
      })
      .addCase(deleteMemberAsync.rejected, (state, action) => {
        const id = action.meta.arg.id;
        membersAdapter.updateOne(state, {
          id,
          changes: {
            status: "failed",
            error: action.error.message,
          },
        });
      });
  },
});

export const selectMembersRequiredReload = (state: RootState) =>
  state.members.requiredReload;
export const selectMembersStatus = (state: RootState) => state.members.status;
export const selectMembersError = (state: RootState) => state.members.error;
export const selectMembersStatusLoading = (state: RootState) =>
  Boolean(state.members.status === "loading");
export const selectMembersStatusSucceeded = (state: RootState) =>
  Boolean(state.members.status === "succeeded");

export const selectMembersExtras = (state: RootState) => state.members.extras;
export const selectMembersExtrasAddStatus = (state: RootState) =>
  state.members.extras.add.status;
export const selectMembersExtrasAddError = (state: RootState) =>
  state.members.extras.add.error;

export const {
  resetAddMemberState,
  resetMembersExtras,
  membersCleared,
  resetMembersState,
  resetMemberStateById,
  resetMemberRequiredReloadById,
  setMembersRequiredReload,
} = membersSlice.actions;

export const reloadAllMembers = (): AppThunk => async (dispatch, getState) => {
  dispatch(resetMembersState());
  dispatch(resetMembersExtras());
  dispatch(membersCleared());
  dispatch(fetchMembersAsync());
};

export const resetMembers = (): AppThunk => async (dispatch, getState) => {
  dispatch(resetMembersState());
  dispatch(resetMembersExtras());
  dispatch(membersCleared());
  // dispatch(setMembersRequiredReload());
};

export default membersSlice.reducer;
