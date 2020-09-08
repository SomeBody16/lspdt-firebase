import React from 'react';
import { useSubmitButton } from '../form';
import { useTranslation } from 'react-i18next';
import {
    ButtonProps,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import RankSelect from '../form/RankSelect';
import { useOfficer, useClaims, useFunction } from '../../firebase';
import { ISetOfficerRankProps } from '../../../functions/src/callable/officer/setOfficerRank';

interface Props {
    officerId: string;
    ButtonProps?: ButtonProps;
}

function ButtonChangeRank(props: Props) {
    const [t] = useTranslation('common');
    const { enqueueSnackbar } = useSnackbar();

    const setOfficerRank = useFunction<ISetOfficerRankProps, void>('setOfficerRank');
    const officer = useOfficer(props.officerId);
    const [rankId, setRankId] = React.useState<string>('');
    React.useEffect(() => {
        if (!officer.value) return;
        setRankId(officer.value.Rank.Id);
    }, [officer.value]);

    const [open, setOpen] = React.useState<boolean>(false);
    const [SubmitButton, setSubmitLoading] = useSubmitButton();

    const handleState = (open: boolean) => () => {
        setSubmitLoading(open);
        setOpen(open);
    };
    const handleSubmit = () => {
        if (officer.value?.Rank.Id === rankId) {
            enqueueSnackbar(t('snackbar.error.rankSame'), {
                variant: 'error',
            });
            return;
        }
        if (rankId.length <= 0) {
            enqueueSnackbar(t('snackbar.error.rankEmpty'), {
                variant: 'error',
            });
            return;
        }

        setOpen(false);
        setOfficerRank({
            officerId: officer.value?.Id || '',
            rankId,
        })
            .then(() => {
                enqueueSnackbar(t('snackbar.rankChanged'), {
                    variant: 'success',
                });
            })
            .finally(() => setSubmitLoading(false));
    };

    const claims = useClaims();
    if (!claims.value?.admin && !claims.value?.permissions?.includes('changeOfficerRank')) {
        return null;
    }
    return (
        <React.Fragment>
            <SubmitButton {...props.ButtonProps} onClick={handleState(true)}>
                {t('officer.details.rank')}
            </SubmitButton>
            <Dialog open={open} onClose={handleState(false)}>
                <DialogTitle>{t('officer.form.SetBadgeNumber')}</DialogTitle>
                <DialogContent>
                    <RankSelect value={rankId} onChange={setRankId} />
                </DialogContent>
                <DialogActions>
                    <Button color='primary' onClick={handleState(false)}>
                        {t('common.form.cancel')}
                    </Button>
                    <Button color='primary' onClick={handleSubmit}>
                        {t('common.form.save')}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default ButtonChangeRank;
