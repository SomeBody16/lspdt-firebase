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
    Avatar,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useAllRanks } from '../../firebase';
import IRank from '../../../functions/src/models/rank.interface';
import DeleteRankButton from '../../components/Config/Ranks/DeleteRankButton';
import EditRankButton from '../../components/Config/Ranks/EditRankButton';
import AddRankButton from '../../components/Config/Ranks/AddRankButton';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        buttonsCell: {
            width: theme.spacing(15),
        },
        actionsContainer: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
        },
        rankImage: {
            height: theme.spacing(4),
        },
        callsignContainer: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
        },
    })
);

function RankRow(rank: IRank) {
    const classes = useStyles();

    return (
        <TableRow className={classes.root}>
            <TableCell>
                <div className={classes.actionsContainer}>
                    <DeleteRankButton rankId={rank.Id} />
                    <EditRankButton rankId={rank.Id} />
                </div>
            </TableCell>
            <TableCell>{rank.Name}</TableCell>
            <TableCell align='right'>
                <img src={rank.ImageUrl} alt={rank.Name} className={classes.rankImage} />
            </TableCell>
            <TableCell align='right'>
                <div className={classes.callsignContainer}>
                    <Avatar>{rank.Callsign}</Avatar>
                </div>
            </TableCell>
        </TableRow>
    );
}

function RanksScreen() {
    const classes = useStyles();
    const [t] = useTranslation('lang');
    const ranks = useAllRanks();

    return (
        <React.Fragment>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.buttonsCell} />
                            <TableCell>{t('Ranga')}</TableCell>
                            <TableCell align='right'>{t('Odznaka')}</TableCell>
                            <TableCell align='right'>{t('Callsign')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ranks.value.map((item) => (
                            <RankRow key={item.Id} {...item} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <AddRankButton />
        </React.Fragment>
    );
}

export default RanksScreen;
