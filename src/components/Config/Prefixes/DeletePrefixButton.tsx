import React from 'react';
import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { AppBarProgressContext } from '../../DrawerContainer/DrawerContainer';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { IDeletePrefixProps } from '../../../../functions/src/callable/config/prefixes/deletePrefix';
import { useFunction } from '../../../firebase';

interface Props {
    prefixId: string;
}

function DeletePrefixButton(props: Props) {
    const [t] = useTranslation('lang');

    const { enqueueSnackbar } = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);

    const deletePrefix = useFunction<IDeletePrefixProps, void>('deletePrefix');

    const [disabled, setDisabled] = React.useState<boolean>(false);
    const handleDelete = () => {
        setAppBarProgress('indeterminate');
        setDisabled(true);

        deletePrefix({ prefixId: props.prefixId })
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

export default DeletePrefixButton;
