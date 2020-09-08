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
import IPrefix from '../../../../functions/src/models/prefix.interface';
import { usePrefix } from '../../../firebase';
import EmojiPrefix from '../../Chips/EmojiPrefix';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formField: {
            marginBottom: theme.spacing(2),
        },
        content: {
            width: '400px',
        },
    })
);

interface Props {
    open: boolean;
    title: string;
    onClose: () => void;
    onSave: (prefix: IPrefix) => void;
    prefixId?: string;
}

function PrefixDialog(props: Props) {
    const classes = useStyles();
    const [t] = useTranslation('lang');

    const [prefix, setPrefix] = React.useState<IPrefix>({} as IPrefix);
    const originalPrefix = usePrefix(props.prefixId);
    React.useEffect(() => {
        if (!originalPrefix.value) return;
        setPrefix(originalPrefix.value);
    }, [originalPrefix.value]);

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent className={classes.content}>
                <TextField
                    className={classes.formField}
                    fullWidth
                    label={t('prefix.description')}
                    value={prefix.Description}
                    onChange={(e) => setPrefix({ ...prefix, Description: e.target.value })}
                />
                <TextField
                    className={classes.formField}
                    fullWidth
                    label={t('prefix.content')}
                    value={prefix.Content}
                    onChange={(e) => setPrefix({ ...prefix, Content: e.target.value })}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position='end'>
                                <EmojiPrefix prefix={prefix} />
                            </InputAdornment>
                        ),
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>{t('common.form.button.cancel')}</Button>
                <Button onClick={() => props.onSave(prefix as IPrefix)}>
                    {t('common.form.button.save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default PrefixDialog;
