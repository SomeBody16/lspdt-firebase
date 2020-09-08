import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import ICrime from '../../../functions/src/models/crime.interface';
import { Chip } from '@material-ui/core';
import EmojiPrefix from './EmojiPrefix';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        chip: {
            margin: theme.spacing(0.5),
        },
        prefix: {
            transform: 'translateY(10%)',
        },
    })
);

function CrimeChip(props: ICrime) {
    const classes = useStyles();
    return (
        <Chip
            className={classes.chip}
            label={props.Name}
            icon={<EmojiPrefix className={classes.prefix} prefix={props.Prefix} size={24} />}
            color='primary'
        />
    );
}

export default CrimeChip;
