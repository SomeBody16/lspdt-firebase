import React from 'react';
import { TextField, TextFieldProps, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useAllPrefixes } from '../../firebase';
import EmojiPrefix from '../Chips/EmojiPrefix';

function PrefixSelect(props: TextFieldProps) {
    const [t] = useTranslation('lang');
    const prefixes = useAllPrefixes();
    return (
        <TextField select label={t('prefix.content')} {...props}>
            {prefixes.value.map((prefix) => (
                <MenuItem key={prefix.Id} value={prefix.Id}>
                    <EmojiPrefix prefix={prefix} /> {prefix.Description}
                </MenuItem>
            ))}
        </TextField>
    );
}

export default PrefixSelect;
