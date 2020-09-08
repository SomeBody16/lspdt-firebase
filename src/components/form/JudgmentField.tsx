import React from 'react';
import { TextField, TextFieldProps, InputAdornment } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

function JudgmentField(props?: TextFieldProps) {
    const [t] = useTranslation('lang');
    return (
        <TextField
            InputProps={{
                endAdornment: (
                    <InputAdornment position='end'>{t('intl.number.judgment.unit')}</InputAdornment>
                ),
            }}
            type='number'
            label={t('crime.judgment')}
            {...props}
        />
    );
}

export default JudgmentField;
