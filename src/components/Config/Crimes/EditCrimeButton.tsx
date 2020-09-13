import React from 'react';
import { IconButton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { AppBarProgressContext } from '../../DrawerContainer/DrawerContainer';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import CrimeDialog from './CrimeDialog';
import ICrime from '../../../../functions/src/models/crime.interface';
import { IEditCrimeProps } from '../../../../functions/src/callable/config/crimes/editCrime';
import { useFunction } from '../../../firebase';

interface Props {
    crimeId: string;
}

function EditCrimeButton(props: Props) {
    const [t] = useTranslation('lang');

    const [disabled, setDisabled] = React.useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);

    const editCrime = useFunction<IEditCrimeProps, void>('editCrime');

    const handleState = (open: boolean) => () => {
        setDisabled(open);
        setIsDialogOpen(open);
    };

    const handleSave = (crime: ICrime) => {
        setIsDialogOpen(false);
        setAppBarProgress('indeterminate');

        editCrime({ crime })
            .then(() => enqueueSnackbar(t('Edytowano!'), { variant: 'success' }))
            .finally(() => {
                setDisabled(false);
                setAppBarProgress(null);
            });
    };

    return (
        <React.Fragment>
            <CrimeDialog
                open={isDialogOpen}
                title={t('Edytuj przestępstwo')}
                onClose={handleState(false)}
                onSave={handleSave}
                crimeId={props.crimeId}
            />
            <IconButton disabled={disabled} size='small' onClick={handleState(true)}>
                <Edit />
            </IconButton>
        </React.Fragment>
    );
}

export default EditCrimeButton;
