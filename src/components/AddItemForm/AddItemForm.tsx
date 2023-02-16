import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

export const AddItemForm = memo((props: AddItemFormPropsType) => {
    const [title, setTitle] = useState("")
    const [error, setError] = useState<string | null>(null)

    const addItem = () => {
        if (title.trim() !== "") {
            props.addItem(title);
            setTitle("");
        } else {
            setError("Title is required");
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error) {
            setError(null);
        }
        if (e.key === 'Enter') {
            addItem();
        }
    }

    return <div>
        <TextField
            value={title}
            onChange={onChangeHandler}
            onKeyDown={onKeyDownHandler}
            id="outlined-basic"
            label={error ? "Title is required" : "type out here..."}
            variant="outlined"
            size="small"
            error={!!error}
        />

        <Button variant="contained" style={{maxWidth: '38px', maxHeight: '38px', minWidth: '38px', minHeight: '38px'}}
                onClick={addItem}>+</Button>
    </div>
})
