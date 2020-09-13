import React from 'react';
import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { AppBarProgressContext } from '../../DrawerContainer/DrawerContainer';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useClaims, useFunction } from '../../../firebase';
import { IDeleteRankProps } from '../../../../functions/src/callable/config/ranks/deleteRank';

interface Props {
    rankId: string;
}

function DeleteRankButton(props: Props) {
    const [t] = useTranslation('lang');

    const { enqueueSnackbar } = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);

    const deleteRank = useFunction<IDeleteRankProps, void>('deleteRank');

    const [disabled, setDisabled] = React.useState<boolean>(false);
    const handleDelete = () => {
        setAppBarProgress('indeterminate');
        setDisabled(true);

        deleteRank({ rankId: props.rankId })
            .then(() => enqueueSnackbar(t('Usunięto!'), { variant: 'success' }))
            .finally(() => {
                setAppBarProgress(null);
                setDisabled(false);
            });
    };

    const claims = useClaims();
    if (!claims.value?.admin && !claims.value?.permissions?.includes('manageRanks')) {
        return null;
    }
    return (
        <IconButton disabled={disabled} size='small' onClick={handleDelete}>
            <Delete />
        </IconButton>
    );
}

export default DeleteRankButton;
