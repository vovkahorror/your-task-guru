import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import {TitleNotificationTextType} from '../../app/app-reducer';
import styles from './EditableSpan.module.scss';

type EditableSpanPropsType = {
    value: string;
    onChange: (newValue: string) => void;
    disabled?: boolean;
    titleType: TitleNotificationTextType;
    isShowedNotification: boolean;
    setNotificationShowing: (isShowedNotification: boolean) => void;
}

export const EditableSpan = memo((props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState(props.value);
    const [openTooltip, setOpenTooltip] = useState(false);

    const activateEditMode = () => {
        if (!props.disabled) {
            setEditMode(true);
            setTitle(props.value);
        }
    };
    const activateViewMode = () => {
        setEditMode(false);
        props.onChange(title);
    };
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    };
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            activateViewMode();
        }
    };
    const setOpenTooltipHandler = () => {
        if (!props.isShowedNotification) {
            props.setNotificationShowing(true);
            setOpenTooltip(true);
            setTimeout(() => setOpenTooltip(false), 3000);
        }
    };

    return (
        <div data-no-dnd={true}>
            {editMode
                ? <TextField size={'small'} value={title} color={'success'} variant="standard"
                             onChange={changeTitle} onKeyDown={onKeyDownHandler} autoFocus onBlur={activateViewMode}/>
                : <Tooltip title={`You can change the title of the ${props.titleType} by double-clicking`}
                           placement={'bottom-start'} open={openTooltip} onOpen={setOpenTooltipHandler} arrow
                           followCursor>
                    <span className={styles.title} onDoubleClick={activateEditMode}>{props.value}</span>
                </Tooltip>}
        </div>
    );
});