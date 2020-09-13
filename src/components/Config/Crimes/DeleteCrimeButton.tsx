import React from 'react';
import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { AppBarProgressContext } from '../../DrawerContainer/DrawerContainer';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { IDeleteCrimeProps } from '../../../../functions/src/callable/config/crimes/deleteCrime';
import { useFunction } from '../../../firebase';

interface Props {
    crimeId: string;
}

function DeleteCrimeButton(props: Props) {
    const [t] = useTranslation('lang');

    const { enqueueSnackbar } = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);

    const deleteCrime = useFunction<IDeleteCrimeProps, void>('deleteCrime');

    const [disabled, setDisabled] = React.useState<boolean>(false);
    const handleDelete = () => {
        setAppBarProgress('indeterminate');
        setDisabled(true);

        deleteCrime({ crimeId: props.crimeId })
            .then(() => enqueueSnackbar(t('Usunięto!'), { variant: 'success' }))
            .finally(() => {
                setAppBarProgress(null);
                setDisabled(false);
            });
    };

    return (
        <IconButton disabled={disabled} size='small' onClick={handleDelete}>
            <Delete />
        </IconButton>
    );
}

export default DeleteCrimeButton;
