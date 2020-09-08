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
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ICrime from '../../../functions/src/models/crime.interface';
import EmojiPrefix from '../../components/Chips/EmojiPrefix';
import { penaltyStr, judgmentStr } from '../../components/Chips/PenaltyJudgment';
import { useAllCrimes } from '../../firebase';
import DeleteCrimeButton from '../../components/Config/Crimes/DeleteCrimeButton';
import EditCrimeButton from '../../components/Config/Crimes/EditCrimeButton';
import AddCrimeButton from '../../components/Config/Crimes/AddCrimeButton';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        actionsContainer: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
        },
    })
);

function CrimeRow(crime: ICrime) {
    const classes = useStyles();
    const useTranslationResponse = useTranslation('lang');

    return (
        <TableRow className={classes.root}>
            <TableCell>
                <div className={classes.actionsContainer}>
                    <DeleteCrimeButton crimeId={crime.Id} />
                    <EditCrimeButton crimeId={crime.Id} />
                </div>
            </TableCell>
            <TableCell>
                <EmojiPrefix prefix={crime.Prefix} /> {crime.Name}
            </TableCell>
            <TableCell align='right'>{penaltyStr(crime.Penalty, useTranslationResponse)}</TableCell>
            <TableCell align='right'>
                {judgmentStr(crime.Judgment, useTranslationResponse)}
            </TableCell>
        </TableRow>
    );
}

function ConfigCrimesScreen() {
    const [t] = useTranslation('common');

    const crimes = useAllCrimes();

    return (
        <React.Fragment>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>{t('citizen.form.arrestMandate.crime')}</TableCell>
                            <TableCell align='right'>
                                {t('citizen.form.arrestMandate.penalty')}
                            </TableCell>
                            <TableCell align='right'>
                                {t('citizen.form.arrestMandate.judgment')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {crimes.value.map((crime) => (
                            <CrimeRow key={crime.Id} {...crime} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AddCrimeButton />
        </React.Fragment>
    );
}

export default ConfigCrimesScreen;
