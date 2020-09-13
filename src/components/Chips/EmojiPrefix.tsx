import React from 'react';
import { emojify } from 'react-emojione';
import IPrefix from '../../../functions/src/models/prefix.interface';
import { Tooltip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface Props {
    prefix: IPrefix;
    size?: number;
    className?: string;
}

function EmojiPrefix(props: Props) {
    const [t] = useTranslation('lang');
    const options = {
        style: {
            width: `${props.size || 32}px`,
            height: `${props.size || 32}px`,
        },
    };
    const translation: string = t(props.prefix?.Description || '');
    return (
        <Tooltip title={translation}>
            <span className={props.className}>{emojify(props.prefix?.Content || '', options)}</span>
        </Tooltip>
    );
}

export default EmojiPrefix;
