import React, {ChangeEvent, memo, useState} from 'react';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import {TitleNotificationType} from '../../app/app-reducer';

type EditableSpanPropsType = {
    value: string;
    onChange: (newValue: string) => void;
    titleType: TitleNotificationType;
    isShowedNotification: boolean;
    setNotificationShowing: (isShowedNotification: boolean) => void;
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
        if (!props.isShowedNotification) {
            props.setNotificationShowing(true);
            setOpenTooltip(true);
            setTimeout(() => setOpenTooltip(false), 3000);
        }
    };

    return editMode
        ? <TextField value={title} onChange={changeTitle} autoFocus onBlur={activateViewMode}/>
        : <Tooltip title={`You can change the title of the ${props.titleType} by double-clicking`}
                   placement={'bottom-start'} open={openTooltip} onOpen={setOpenTooltipHandler} arrow followCursor>
            <span onDoubleClick={activateEditMode}>{props.value}</span>
        </Tooltip>;
});
