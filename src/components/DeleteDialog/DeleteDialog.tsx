import {Dialog, DialogActions, DialogTitle} from '@mui/material';
import Button from '@mui/material/Button';
import React, {FC, memo} from 'react';

export const DeleteDialog: FC<DeleteDialogPropsType> = memo(({title, openDialog, handleCloseDialog, deleteHandler}) => {
    return (
        <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            data-no-dnd={true}
        >
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogActions>
                <Button onClick={handleCloseDialog} color={'error'}>Cancel</Button>
                <Button onClick={deleteHandler} color={'success'}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
});

type DeleteDialogPropsType = {
    title: string;
    openDialog: boolean;
    handleCloseDialog: () => void;
    deleteHandler: () => void;
}