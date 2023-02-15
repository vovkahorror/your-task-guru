import React, {ChangeEvent, memo, useState} from 'react';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

type EditableSpanPropsType = {
    value: string;
    onChange: (newValue: string) => void;
    type: string;
}

export const EditableSpan = memo((props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState(props.value);
    const [openTooltip, setOpenTooltip] = useState(false);

    const activateEditMode = () => {
        setEditMode(true);
        setTitle(props.value);
    };
    const activateViewMode = () => {
        setEditMode(false);
        props.onChange(title);
    };
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    };
    const setOpenTooltipHandler = () => {
        setOpenTooltip(true);
        setTimeout(() => setOpenTooltip(false), 1500);
    };

    return editMode
        ? <TextField value={title} onChange={changeTitle} autoFocus onBlur={activateViewMode}/>
        : <Tooltip title={`You can change the name of the ${props.type} by double-clicking`}
                   placement={'bottom-start'} open={openTooltip} onOpen={setOpenTooltipHandler} arrow>
            <span onDoubleClick={activateEditMode}>{props.value}</span>
        </Tooltip>;
});
