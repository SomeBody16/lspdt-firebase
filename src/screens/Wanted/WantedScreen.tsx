import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import ICitizen from "../../../functions/src/models/citizen.interface";
import {useHistory} from "react-router-dom";
import {
  Avatar,
  Divider,
  IconButton, List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import MoreIcon from "@material-ui/icons/More";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // Component styles
  })
);

function CitizenItem(citizen: ICitizen & { isLast: boolean }) {
  const history = useHistory();

  const handleMoreButtonClick = () => {
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

function WantedScreen() {
  const classes = useStyles();

  const citizen: ICitizen = {
    BirthDate: '06-01-2000',
    CreateTime: Date.now(),
    Id: 'asd',
    Name: 'Samuel',
    Surname: 'Buddy',
    Server: 'dev',
    PhoneNumber: '123-1234'
  }

  return (
    <List>
      <CitizenItem {...citizen} isLast={true} />
    </List>
  );
}

export default WantedScreen;
