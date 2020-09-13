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
import EmojiPrefix from '../../components/Chips/EmojiPrefix';
import DeletePrefixButton from '../../components/Config/Prefixes/DeletePrefixButton';
import EditPrefixButton from '../../components/Config/Prefixes/EditPrefixButton';
import AddPrefixButton from '../../components/Config/Prefixes/AddPrefixButton';
import { useAllPrefixes } from '../../firebase';
import IPrefix from '../../../functions/src/models/prefix.interface';

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
        prefixContainer: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
        },
    })
);

function PrefixRow(prefix: IPrefix) {
    const classes = useStyles();

    return (
        <TableRow className={classes.root}>
            <TableCell>
                <div className={classes.actionsContainer}>
                    <DeletePrefixButton prefixId={prefix.Id} />
                    <EditPrefixButton prefixId={prefix.Id} />
                </div>
            </TableCell>
            <TableCell>{prefix.Description}</TableCell>
            <TableCell>
                <div className={classes.prefixContainer}>
                    <EmojiPrefix prefix={prefix} />
                </div>
            </TableCell>
        </TableRow>
    );
}

function PrefixesScreen() {
    const [t] = useTranslation('lang');

    const prefixes = useAllPrefixes();

    return (
        <React.Fragment>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>{t('Przeznaczenie')}</TableCell>
                            <TableCell align='right'>{t('Grafika')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {prefixes.value.map((prefix) => (
                            <PrefixRow key={prefix.Id} {...prefix} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AddPrefixButton />
        </React.Fragment>
    );
}

export default PrefixesScreen;
