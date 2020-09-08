import React from 'react';
import { IconButton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { AppBarProgressContext } from '../../DrawerContainer/DrawerContainer';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import PrefixDialog from './RankDialog';
import IRank from '../../../../functions/src/models/rank.interface';
import { useClaims, useFunction } from '../../../firebase';
import { IEditRankProps } from '../../../../functions/src/callable/config/ranks/editRank';

interface Props {
    rankId: string;
}

function EditRankButton(props: Props) {
    const [t] = useTranslation('lang');

    const [disabled, setDisabled] = React.useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);

    const editRank = useFunction<IEditRankProps, void>('editRank');

    const handleState = (open: boolean) => () => {
        setDisabled(open);
        setIsDialogOpen(open);
    };

    const handleSave = (rank: IRank) => {
        setIsDialogOpen(false);
        setAppBarProgress('indeterminate');

        editRank({ rank })
            .then(() => enqueueSnackbar(t('rank.message.edited'), { variant: 'success' }))
            .finally(() => {
                setDisabled(false);
                setAppBarProgress(null);
            });
    };

    const claims = useClaims();
    if (!claims.value?.admin && !claims.value?.permissions?.includes('manageRanks')) {
        return null;
    }
    return (
        <React.Fragment>
            <PrefixDialog
                open={isDialogOpen}
                title={t('rank.action.edit')}
                onClose={handleState(false)}
                onSave={handleSave}
                rankId={props.rankId}
            />
            <IconButton disabled={disabled} size='small' onClick={handleState(true)}>
                <Edit />
            </IconButton>
        </React.Fragment>
    );
}

export default EditRankButton;
