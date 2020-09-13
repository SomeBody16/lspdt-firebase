import React from 'react';
import { TextField, MenuItem, TextFieldProps } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useAllRanks } from '../../firebase';

interface Props {
    value?: string;
    onChange?: (rankId: string) => void;
    TextFieldProps?: TextFieldProps;
}

function RankSelect(props: Props) {
    const [t] = useTranslation('lang');

    const allRanks = useAllRanks();

    return (
        <TextField
            select
            label={t('Ranga')}
            value={props.value}
            onChange={(e) => props.onChange && props.onChange(e.target.value)}
            fullWidth
            {...props.TextFieldProps}
        >
            {allRanks.value.map((rank) => (
                <MenuItem key={rank.Id} value={rank.Id}>
                    {rank.Callsign} - {rank.Name}
                </MenuItem>
            ))}
        </TextField>
    );
}

export default RankSelect;
