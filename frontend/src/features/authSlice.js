import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: null,
    status: false,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        storeLogin: (state, action) => {
            (state.userData = action.payload), (state.status = true);
        },
        storeLogout: (state) => {
            (state.userData = null), (state.status = false);
        },
    },
});

export const { storeLogin, storeLogout } = authSlice.actions;
export default authSlice.reducer;
