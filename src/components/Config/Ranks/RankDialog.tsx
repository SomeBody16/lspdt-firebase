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
    InputAdornment,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useRank } from '../../../firebase';
import IRank from '../../../../functions/src/models/rank.interface';
import PermissionSelect from '../../form/PermissionSelect';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formField: {
            marginBottom: theme.spacing(2),
        },
        content: {
            width: '400px',
        },
        rankImage: {
            height: theme.spacing(4),
        },
    })
);

interface Props {
    open: boolean;
    title: string;
    onClose: () => void;
    onSave: (rank: IRank) => void;
    rankId?: string;
}

function RankDialog(props: Props) {
    const classes = useStyles();
    const [t] = useTranslation('lang');

    const [rank, setRank] = React.useState<IRank>({} as IRank);
    const originalRank = useRank(props.rankId);
    React.useEffect(() => {
        if (!originalRank.value) return;
        setRank(originalRank.value);
    }, [originalRank.value]);

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent className={classes.content}>
                <TextField
                    className={classes.formField}
                    fullWidth
                    label={t('rank.name')}
                    value={rank.Name || ''}
                    onChange={(e) => setRank({ ...rank, Name: e.target.value })}
                />
                <TextField
                    className={classes.formField}
                    fullWidth
                    label={t('rank.callsign')}
                    value={rank.Callsign || ''}
                    onChange={(e) => setRank({ ...rank, Callsign: e.target.value })}
                />
                <TextField
                    className={classes.formField}
                    fullWidth
                    label={t('rank.image')}
                    value={rank.ImageUrl || ''}
                    onChange={(e) => setRank({ ...rank, ImageUrl: e.target.value })}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position='end'>
                                <img src={rank.ImageUrl} alt='' className={classes.rankImage} />
                            </InputAdornment>
                        ),
                    }}
                />
                <PermissionSelect
                    TextFieldProps={{
                        SelectProps: {
                            multiple: true,
                            value: rank.Permissions || [],
                            onChange: (e: any) =>
                                setRank({
                                    ...rank,
                                    Permissions: e.target.value as string[],
                                }),
                        },
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>{t('common.form.button.cancel')}</Button>
                <Button onClick={() => props.onSave(rank as IRank)}>
                    {t('common.form.button.save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default RankDialog;
