import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {logIn, logOut} from './auth-actions';

// slice
export const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },

    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn;
        },
    },

    extraReducers: builder => {
        builder.addCase(logIn.fulfilled, (state) => {
            state.isLoggedIn = true;
        });
        builder.addCase(logOut.fulfilled, (state) => {
            state.isLoggedIn = false;
        });
    },
});

export const {setIsLoggedIn} = slice.actions;
