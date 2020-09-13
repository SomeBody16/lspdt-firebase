import React from 'react';
import { TextField, TextFieldProps, InputAdornment } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

function PenaltyField(props?: TextFieldProps) {
    const [t] = useTranslation('lang');
    return (
        <TextField
            InputProps={{
                endAdornment: (
                    <InputAdornment position='end'>
                        {t('intl.number.penalty.currency')}
                    </InputAdornment>
                ),
            }}
            type='number'
            label={t('Grzywna')}
            {...props}
        />
    );
}

export default PenaltyField;
