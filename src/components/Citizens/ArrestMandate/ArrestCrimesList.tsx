import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import {
    List,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ListItem,
    ListItemSecondaryAction,
} from '@material-ui/core';
import { useAllCrimes } from '../../../firebase';
import EmojiPrefix from '../../Chips/EmojiPrefix';
import PenaltyJudgment from '../../Chips/PenaltyJudgment';
import ICrime from '../../../../functions/src/models/crime.interface';
import { red } from '@material-ui/core/colors';
import { SelectedCrimesContext } from '../../../screens/Citizens/ArrestMandateScreen';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        selected: {
            backgroundColor: theme.palette.secondary.dark,
        },
        count: {
            color: theme.palette.getContrastText(red[500]),
            backgroundColor: red[500],
        },
    })
);

export interface ICrimeWithCount extends ICrime {
    count: number;
}

function ArrestCrimesList() {
    const classes = useStyles();
    const crimes = useAllCrimes();

    const [crimesWithCount, setCrimesWithCount] = React.useContext(SelectedCrimesContext);

    React.useEffect(() => {
        setCrimesWithCount(
            crimes.value.map((crime) => ({
                ...crime,
                count: 0,
            }))
        );
    }, [crimes.value, setCrimesWithCount]);

    const handleChange = async (event: any, crime: ICrimeWithCount, amount: 1 | -1) => {
        const newCrimesWithCount = crimesWithCount.map((c) => {
            if (c.Id === crime.Id) c.count += amount;
            if (c.count < 0) c.count = 0;
            return c;
        });
        setCrimesWithCount(newCrimesWithCount);
        event.preventDefault();
    };

    return (
        <List>
            {crimesWithCount.map((item) => (
                <ListItem
                    className={item.count > 0 ? classes.selected : undefined}
                    key={item.Id}
                    onClick={(e) => handleChange(e, item, 1)}
                    onContextMenu={(e) => handleChange(e, item, -1)}
                >
                    <ListItemAvatar>
                        <EmojiPrefix prefix={item.Prefix} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={item.Name}
                        secondary={
                            <PenaltyJudgment penalty={item.Penalty} judgment={item.Judgment} />
                        }
                    />
                    {item.count > 0 && (
                        <ListItemSecondaryAction>
                            <Avatar className={classes.count}>{item.count}</Avatar>
                        </ListItemSecondaryAction>
                    )}
                </ListItem>
            ))}
        </List>
    );
}

export default ArrestCrimesList;
