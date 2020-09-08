import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import {
    TableContainer,
    Paper,
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    IconButton,
    Collapse,
    Box,
    Avatar,
    DialogActions,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useAllOfficers } from '../../firebase';
import IOfficer from '../../../functions/src/models/officer.interface';
import { KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons';
import CitizenChip from '../../components/Chips/CitizenChip';
import ButtonChangeBadgeNumber from '../../components/Police/ButtonChangeBadgeNumber';
import ButtonChangeRank from '../../components/Police/ButtonChangeRank';
import ButtonFireOfficer from '../../components/Police/ButtonFireOfficer';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                borderBottom: 'unset',
            },
        },
        collapseCell: {
            paddingBottom: 0,
            paddingTop: 0,
        },
        officerRankImage: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(3),

            '& img': {
                height: theme.spacing(4),
                marginLeft: theme.spacing(2),
            },
        },
        officerBadgeNumber: {
            width: theme.spacing(4),
            height: theme.spacing(4),
            marginLeft: 'auto',
        },
    })
);

function PolicemanData(officer: IOfficer) {
    const [t] = useTranslation('common');

    const data = [
        {
            property: t('citizen.details.birthDate'),
            value: officer.Citizen.BirthDate,
        },
        {
            property: t('citizen.details.phoneNumber'),
            value: officer.Citizen.PhoneNumber,
        },
    ];

    return (
        <React.Fragment>
            <Table size='small'>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.property}>
                            <TableCell>{item.property}</TableCell>
                            <TableCell>{item.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <DialogActions>
                <ButtonChangeBadgeNumber officerId={officer.Id} />
                <ButtonChangeRank officerId={officer.Id} />
                <ButtonFireOfficer officerId={officer.Id} />
            </DialogActions>
        </React.Fragment>
    );
}

function PolicemanRow(officer: IOfficer) {
    const classes = useStyles();
    const [open, setOpen] = React.useState<boolean>(false);
    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton size='small' onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    <CitizenChip {...officer.Citizen} />
                </TableCell>
                <TableCell align='right' className={classes.officerRankImage}>
                    <img alt={officer.Rank.Name} src={officer.Rank.ImageUrl} />
                    {officer.Rank.Name}
                </TableCell>
                <TableCell align='right'>
                    <Avatar className={classes.officerBadgeNumber}>{officer.BadgeNumber}</Avatar>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell className={classes.collapseCell} colSpan={4}>
                    <Collapse in={open} timeout='auto' unmountOnExit>
                        <Box margin={1}>
                            <PolicemanData {...officer} />
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

function PoliceScreen() {
    const [t] = useTranslation('common');

    const officers = useAllOfficers();

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>{t('citizen.details.nameSurname')}</TableCell>
                        <TableCell align='right'>{t('officer.details.rank')}</TableCell>
                        <TableCell align='right'>{t('officer.details.badgeNumber')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {officers.value.map((item) => (
                        <PolicemanRow key={item.Id} {...item} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default PoliceScreen;
