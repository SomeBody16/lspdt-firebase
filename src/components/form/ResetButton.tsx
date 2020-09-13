import React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

function ResetButton(props: ButtonProps) {
    const [t] = useTranslation('lang');
    return (
        <Button variant='contained' color='secondary' {...props}>
            {t('Resetuj')}
        </Button>
    );
}

export default ResetButton;
