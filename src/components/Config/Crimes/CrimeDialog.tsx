import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ICrime from '../../../../functions/src/models/crime.interface';
import { useCrime, useAllPrefixes } from '../../../firebase';
import PenaltyField from '../../form/PenaltyField';
import JudgmentField from '../../form/JudgmentField';
import PrefixSelect from '../../form/PrefixSelect';
import IPrefix from '../../../../functions/src/models/prefix.interface';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formField: {
            marginBottom: theme.spacing(2),
        },
    })
);

interface Props {
    open: boolean;
    title: string;
    onClose: () => void;
    onSave: (crime: ICrime) => void;
    crimeId?: string;
}

function CrimeDialog(props: Props) {
    const classes = useStyles();
    const [t] = useTranslation('lang');

    const allPrefixes = useAllPrefixes();

    const [crime, setCrime] = React.useState<ICrime>({} as ICrime);
    const originalCrime = useCrime(props.crimeId);
    React.useEffect(() => {
        if (!originalCrime.value) return;
        setCrime(originalCrime.value);
    }, [originalCrime.value]);

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <TextField
                    className={classes.formField}
                    fullWidth
                    label={t('crime.name')}
                    value={crime.Name}
                    onChange={(e) => setCrime({ ...crime, Name: e.target.value })}
                />
                <PenaltyField
                    className={classes.formField}
                    fullWidth
                    value={crime.Penalty}
                    onChange={(e) => setCrime({ ...crime, Penalty: +e.target.value })}
                />
                <JudgmentField
                    className={classes.formField}
                    fullWidth
                    value={crime.Judgment}
                    onChange={(e) => setCrime({ ...crime, Judgment: +e.target.value })}
                />
                <PrefixSelect
                    className={classes.formField}
                    fullWidth
                    value={crime.Prefix?.Id || ''}
                    onChange={(e) =>
                        setCrime({
                            ...crime,
                            Prefix: allPrefixes.value.find(
                                (p) => p.Id === e.target.value
                            ) as IPrefix,
                        })
                    }
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>{t('common.form.button.cancel')}</Button>
                <Button onClick={() => props.onSave(crime as ICrime)}>
                    {t('common.form.button.save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CrimeDialog;
