import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import TodayIcon from '@material-ui/icons/Today';
import { useTranslation } from 'react-i18next';
import { Chip, Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        chip: {
            margin: theme.spacing(1),
        },
    })
);

interface Props {
    template: string;
    children: any;
}

function DateTimeChip(props: Props) {
    const classes = useStyles();
    const [t, i18n] = useTranslation('lang');

    const dateTime = new Date(props.children);
    const template = t(`intl.dateTime.${props.template}`, { returnObjects: true }) as object;

    const result = Intl.DateTimeFormat(i18n.language, template).format(dateTime);
    const difference = Math.ceil((Date.now() - dateTime.getTime()) / (1000 * 60 * 60 * 24));
    return (
        <Tooltip title={new Intl.RelativeTimeFormat(i18n.language).format(difference, 'day')}>
            <Chip className={classes.chip} label={result} icon={<TodayIcon />} />
        </Tooltip>
    );
}

export default DateTimeChip;
