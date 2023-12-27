import {createTheme} from '@mui/material';
import {ReactNode} from 'react';
import {ThemeProvider} from '@emotion/react';
import React from 'react';

export const withDarkTheme = (component: ReactNode) => {
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
            {component}
        </ThemeProvider>
    );
};