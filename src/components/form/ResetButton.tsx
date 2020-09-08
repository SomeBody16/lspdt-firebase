import React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

function ResetButton(props: ButtonProps) {
    const [t] = useTranslation('common');
    return (
        <Button variant='contained' color='secondary' {...props}>
            {t('common.form.reset')}
        </Button>
    );
}

export default ResetButton;
