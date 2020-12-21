import React, {ChangeEvent, useCallback, useMemo, useState} from 'react';
import {Theme, createStyles} from '@material-ui/core/styles';
import {makeStyles} from '@material-ui/styles';
import {
    List,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ListItem,
    ListItemSecondaryAction, IconButton, TextField,
} from '@material-ui/core';
import {useAllCrimes, useCitizen} from '../../../firebase';
import EmojiPrefix from '../../Chips/EmojiPrefix';
import PenaltyJudgment from '../../Chips/PenaltyJudgment';
import ICrime from '../../../../functions/src/models/crime.interface';
import {red} from '@material-ui/core/colors';
import {SelectedCrimesContext} from '../../../screens/Citizens/ArrestMandateScreen';
import {useParams} from "react-router-dom";
import ICitizen from "../../../../functions/src/models/citizen.interface";
import {Feedback} from "@material-ui/icons";
import {useSnackbar} from "notistack";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        selected: {
            backgroundColor: theme.palette.secondary.dark,
        },
        count: {
            color: theme.palette.getContrastText(red[500]),
            backgroundColor: red[500],
        },
        comment: {

        }
    })
);

export interface ICrimeWithCount extends ICrime {
    count: number;
}

function CrimeItem(item: ICrimeWithCount & { handleChange: (e: any, item: ICrimeWithCount, count: 1 | -1) => void }) {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const commentClickHandler = useCallback((e:  React.MouseEvent) => {
        enqueueSnackbar(item.Comment, {variant: 'warning'});
        e.preventDefault();
        e.stopPropagation();
    }, [item, enqueueSnackbar]);

    return (
        <ListItem
            className={item.count > 0 ? classes.selected : undefined}
            onClick={(e) => item.handleChange(e, item, 1)}
            onContextMenu={(e) => item.handleChange(e, item, -1)}
        >
            <ListItemAvatar>
                <EmojiPrefix prefix={item.Prefix}/>
            </ListItemAvatar>
            <ListItemText
                primary={item.Name}
                secondary={
                    <PenaltyJudgment penalty={item.Penalty} judgment={item.Judgment}/>
                }
            />
            {(item.count > 0 || item.Comment) && (
                <ListItemSecondaryAction
                    onClick={(e) => item.handleChange(e, item, 1)}
                    onContextMenu={(e) => item.handleChange(e, item, -1)}
                >
                    {item.count ? (
                        <Avatar className={classes.count}>
                            {item.count}
                        </Avatar>
                    ) : (
                        <IconButton onClick={commentClickHandler}>
                            <Feedback/>
                        </IconButton>
                    )}
                </ListItemSecondaryAction>
            )}
        </ListItem>
    )
}

export function crimeName(item: ICrime, citizen: ICitizen | undefined): string {
    let name = item.Name;
    if (item.Recidivism) {
        const citizenRecidivism = citizen?.Recidivism;
        name += ` (R${citizenRecidivism ? citizenRecidivism[item.Id] || 0 : 0})`;
    }

    return name;
}

export function crimeRecidivism(item: ICrime, value: number, citizen: ICitizen | undefined, multiplier: number): number {
    let result = value;

    if (item.Recidivism) {
        const citizenRecidivism = citizen?.Recidivism;
        if (citizenRecidivism && item.Id in citizenRecidivism) {
            result += value * citizenRecidivism[item.Id] * multiplier;
        }
    }

    return result;
}

function ArrestCrimesList() {
    const crimes = useAllCrimes();

    const [crimesWithCount, setCrimesWithCount] = React.useContext(SelectedCrimesContext);

    const {citizenId} = useParams() as any;
    const citizen = useCitizen(citizenId);

    React.useEffect(() => {
        setCrimesWithCount(
            crimes.value.map((crime) => ({
                ...crime,
                Name: crimeName(crime, citizen.value),
                Penalty: crimeRecidivism(crime, crime.Penalty, citizen.value, 0.5),
                Judgment: crimeRecidivism(crime, crime.Judgment, citizen.value, 1.0),
                count: 0,
            }))
        );
    }, [crimes.value, setCrimesWithCount, citizen.value]);

    const handleChange = async (event: any, crime: ICrimeWithCount, amount: 1 | -1) => {
        const newCrimesWithCount = crimesWithCount.map((c) => {
            if (c.Id === crime.Id) c.count += amount;
            if (c.count < 0) c.count = 0;
            return c;
        });
        setCrimesWithCount(newCrimesWithCount);
        event.preventDefault();
    };

    const [filterValue, setFilterValue] = useState<string>('');
    const filteredCrimes = useMemo(() => {
        if (!filterValue) return crimesWithCount;
        return crimesWithCount.filter(c => c.Name.includes(filterValue) || c.Comment?.includes(filterValue));
    }, [filterValue, crimesWithCount]);

    return (
        <React.Fragment>
            <TextField
                label='Filtruj'
                fullWidth
                value={filterValue}
                onInput={(e: ChangeEvent<HTMLInputElement>) => setFilterValue(e.target.value)}
            />
            <List>
                {filteredCrimes.map((item) => (
                    <CrimeItem {...item} handleChange={handleChange} key={item.Id}/>
                ))}
            </List>
        </React.Fragment>
    );
}

export default ArrestCrimesList;
