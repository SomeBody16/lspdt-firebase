import React from 'react';
import { useCitizen } from '../../../firebase';
import { List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import TodayIcon from '@material-ui/icons/Today';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import { useTranslation } from 'react-i18next';

interface Props {
    citizenId: string;
}

function CitizenInfoItem(props: { icon: any; label: string; value: string }) {
    return (
        <ListItem>
            <ListItemIcon>{props.icon}</ListItemIcon>
            <ListItemText primary={props.value} secondary={props.label} />
        </ListItem>
    );
}

function CitizenInfo(props: Props) {
    const citizen = useCitizen(props.citizenId);
    const [t] = useTranslation('lang');

    return (
        <List>
            <CitizenInfoItem
                icon={<FaceIcon />}
                label={t('Imię i nazwisko')}
                value={`${citizen.value?.Name || '...'} ${citizen.value?.Surname || '...'}`}
            />
            <CitizenInfoItem
                icon={<TodayIcon />}
                label={t('Data urodzenia')}
                value={citizen.value?.BirthDate || '...'}
            />
            <CitizenInfoItem
                icon={<PhoneAndroidIcon />}
                label={t('Numer telefonu')}
                value={citizen.value?.PhoneNumber || '...'}
            />
        </List>
    );
}

export default CitizenInfo;
