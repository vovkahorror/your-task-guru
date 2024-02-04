import React, {FC, memo, useCallback, useRef, useState} from 'react';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';

export const TextWithCopyToClipboard: FC<TextWithCopyToClipboardPropsType> = memo(({text}) => {
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    const handleClick = useCallback(() => {
        setOpen(true);
        navigator.clipboard.writeText(text);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setOpen(false), 1000);
    }, [text]);

    return (
        <Tooltip title={'Copied'} open={open} placement={'bottom'} followCursor>
                <span>
                    {text}
                    <IconButton onClick={handleClick}>
                        <ContentCopyIcon/>
                    </IconButton>
                </span>
        </Tooltip>
    );
});

type TextWithCopyToClipboardPropsType = {
    text: string;
}