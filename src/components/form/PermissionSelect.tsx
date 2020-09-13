import React from 'react';
import { TextField, MenuItem, TextFieldProps } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useAllPermissions } from '../../firebase';

interface Props {
    value?: string;
    onChange?: (permission: string) => void;
    TextFieldProps?: TextFieldProps;
}

function PermissionSelect(props: Props) {
    const [t] = useTranslation('lang');

    const permissions = useAllPermissions();

    return (
        <TextField
            select
            label={t('Permisje')}
            value={props.value}
            onChange={(e) => props.onChange && props.onChange(e.target.value)}
            fullWidth
            {...props.TextFieldProps}
        >
            {permissions.value.map((item) => (
                <MenuItem key={item} value={item}>
                    {t(`${item}`)}
                </MenuItem>
            ))}
        </TextField>
    );
}

export default PermissionSelect;
