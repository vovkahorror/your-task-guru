import React, {ChangeEvent, FC, KeyboardEvent, memo, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import styles from './AddItemForm.module.scss';

export const AddItemForm: FC<AddItemFormPropsType> = memo(({addItem, disabled}) => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState<string | null>(null);

    const addItemHandler = () => {
        if (title.trim() !== '') {
            addItem(title, {setError, setTitle});
        } else {
            setError('Title is required');
        }
    };

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    };

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error) {
            setError(null);
        }
        if (e.key === 'Enter') {
            addItemHandler();
        }
    };

    return (
        <div className={styles.addItemForm}>
            <TextField
                value={title}
                onChange={onChangeHandler}
                onKeyDown={onKeyDownHandler}
                label={'Title'}
                variant="outlined"
                size="small"
                error={!!error}
                helperText={error}
                disabled={disabled}
            />
            <Button variant="contained" color={'success'} disabled={disabled}
                    className={styles.button}
                    onClick={addItemHandler}>+</Button>
        </div>
    );
});

export type AddItemFormSubmitHelpersType = {
    setError: (error: string) => void;
    setTitle: (title: string) => void;
}

type AddItemFormPropsType = {
    addItem: (title: string, helpers: AddItemFormSubmitHelpersType) => void;
    disabled?: boolean;
}
