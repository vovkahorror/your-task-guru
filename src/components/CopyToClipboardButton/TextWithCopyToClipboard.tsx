import React, {FC, useState} from 'react';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';

export const TextWithCopyToClipboard: FC<TextWithCopyToClipboardPropsType> = ({text}) => {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(true);
        navigator.clipboard.writeText(text);
        setTimeout(() => setOpen(false), 1000);
    };

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
};

type TextWithCopyToClipboardPropsType = {
    text: string;
}