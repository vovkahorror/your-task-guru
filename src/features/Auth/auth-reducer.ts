import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {logIn, logOut} from './auth-actions';

// slice
export const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        captchaUrl: null as string | null,
    },

    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn;
        },
        setCaptchaUrl(state, action: PayloadAction<{ captchaUrl: string | null}>) {
            state.captchaUrl = action.payload.captchaUrl;
        }
    },

    extraReducers: builder => {
        builder
            .addCase(logIn.fulfilled, (state) => {
                state.isLoggedIn = true;
            })
            .addCase(logOut.fulfilled, (state) => {
                state.isLoggedIn = false;
            })
    },
});

export const {setIsLoggedIn, setCaptchaUrl} = slice.actions;
