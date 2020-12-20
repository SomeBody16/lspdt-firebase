import firebase from "firebase";
import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import ICitizen from '../../../../functions/src/models/citizen.interface';
import {
    List,
    ListItem,
    ListItemText,
    Avatar,
    ListItemAvatar,
    ListItemSecondaryAction,
    IconButton,
    Divider,
    Typography,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import MoreIcon from '@material-ui/icons/More';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.paper,
        },
    })
);

interface Props {
    searchResult: ICitizen[];
}

function CitizenItem(citizen: ICitizen & { isLast: boolean }) {
    const history = useHistory();

    const handleMoreButtonClick = () => {
        firebase.analytics().logEvent('citizen_search_existed', citizen);
        history.push(`/tablet/citizen/${citizen.Id}`);
    };

    return (
        <div>
            <ListItem>
                <ListItemAvatar>
                    {citizen.ImageUrl ? (
                        <Avatar alt={citizen.Name} src={citizen.ImageUrl} />
                    ) : (
                        <Avatar>
                            <PersonIcon />
                        </Avatar>
                    )}
                </ListItemAvatar>
                <ListItemText
                    primary={`${citizen.Name} ${citizen.Surname}`}
                    secondary={citizen.BirthDate}
                />
                <ListItemSecondaryAction>
                    <IconButton edge='end' onClick={handleMoreButtonClick}>
                        <MoreIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            {!citizen.isLast && <Divider />}
        </div>
    );
}

function SearchResult(props: Props) {
    const classes = useStyles();
    const [t] = useTranslation('common');

    if (!props.searchResult || props.searchResult.length <= 0) {
        return <Typography>{t('Brak wyników')}</Typography>;
    }
    return (
        <div className={classes.root}>
            <List>
                {props.searchResult.map((item, index) => (
                    <CitizenItem
                        key={item.Id}
                        {...item}
                        isLast={index === props.searchResult.length - 1}
                    />
                ))}
            </List>
        </div>
    );
}

export default SearchResult;
