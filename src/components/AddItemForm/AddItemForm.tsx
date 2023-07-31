import React, {ChangeEvent, FC, KeyboardEvent, memo, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

type AddItemFormPropsType = {
    addItem: (title: string) => Promise<any>;
    disabled?: boolean;
}

export const AddItemForm: FC<AddItemFormPropsType> = memo(({addItem, disabled}) => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState<string | null>(null);

    const addItemHandler = async () => {
        if (title.trim() !== '') {
            try {
                await addItem(title);
                setTitle('');
            } catch (e) {
                const error = e as Error;
                setError(error.message);
            }
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

    return <div>
        <TextField
            value={title}
            onChange={onChangeHandler}
            onKeyDown={onKeyDownHandler}
            id="outlined-basic"
            label={'type out here...'}
            variant="outlined"
            size="small"
            error={!!error}
            helperText={error}
            disabled={disabled}
        />
        <Button variant="contained" disabled={disabled}
                style={{maxWidth: '38px', maxHeight: '38px', minWidth: '38px', minHeight: '38px'}}
                onClick={addItemHandler}>+</Button>
    </div>;
});
