import React from 'react';
import { IconButton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { AppBarProgressContext } from '../../DrawerContainer/DrawerContainer';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import PrefixDialog from './PrefixDialog';
import IPrefix from '../../../../functions/src/models/prefix.interface';
import { IEditPrefixProps } from '../../../../functions/src/callable/config/prefixes/editPrefix';
import { useFunction } from '../../../firebase';

interface Props {
    prefixId: string;
}

function EditPrefixButton(props: Props) {
    const [t] = useTranslation('lang');

    const [disabled, setDisabled] = React.useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);

    const editPrefix = useFunction<IEditPrefixProps, void>('editPrefix');

    const handleState = (open: boolean) => () => {
        setDisabled(open);
        setIsDialogOpen(open);
    };

    const handleSave = (prefix: IPrefix) => {
        setIsDialogOpen(false);
        setAppBarProgress('indeterminate');

        editPrefix({ prefix })
            .then(() => enqueueSnackbar(t('Edytowano!'), { variant: 'success' }))
            .finally(() => {
                setDisabled(false);
                setAppBarProgress(null);
            });
    };

    return (
        <React.Fragment>
            <PrefixDialog
                open={isDialogOpen}
                title={t('Edytuj ikonę')}
                onClose={handleState(false)}
                onSave={handleSave}
                prefixId={props.prefixId}
            />
            <IconButton disabled={disabled} size='small' onClick={handleState(true)}>
                <Edit />
            </IconButton>
        </React.Fragment>
    );
}

export default EditPrefixButton;
