import React, {useEffect, useState} from 'react';
import {useAllCrimes, useCitizen} from '../../../firebase';
import {List, ListItem, ListItemText, ListItemIcon} from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import VisibilityIcon from '@material-ui/icons/Visibility';
import TodayIcon from '@material-ui/icons/Today';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import {useTranslation} from 'react-i18next';
import {penaltyJudgmentStr} from "../../Chips/PenaltyJudgment";
import ICitizen from "../../../../functions/src/models/citizen.interface";
import ICrime from "../../../../functions/src/models/crime.interface";
import HeightIcon from "@material-ui/icons/Height";

interface Props {
    citizenId: string;
    modeWanted?: boolean;
}

function CitizenInfoItem(props: { icon: any; label: string; value: string | JSX.Element }) {
    return (
        <ListItem>
            <ListItemIcon>{props.icon}</ListItemIcon>
            <ListItemText primary={props.value} secondary={props.label}/>
        </ListItem>
    );
}

function WantedSummary(citizen: ICitizen) {
    const crimes = useAllCrimes();
    const useTranslationResponse = useTranslation('lang');

    const [summary, setSummary] = useState<string>('...');
    useEffect(() => {
        if (!citizen.WantedCrimesIds?.length) {
            return;
        }
        const citizenCrimes = citizen.WantedCrimesIds
            .map(crimeId => {
                const findIndex = crimes.value.findIndex(c => c.Id === crimeId);
                if (findIndex === -1) return null;
                return crimes.value[findIndex];
            })
            .filter(crime => crime !== null) as ICrime[];

        setSummary(penaltyJudgmentStr({
            judgment: citizenCrimes.reduce((prev, curr) => prev + curr.Judgment, 0),
            penalty: citizenCrimes.reduce((prev, curr) => prev + curr.Penalty, 0)
        }, useTranslationResponse));
    }, [citizen.WantedCrimesIds, crimes.value, useTranslationResponse]);

    return (
        <React.Fragment>
            {summary}
        </React.Fragment>
    )
}

function CitizenInfo(props: Props) {
    const citizen = useCitizen(props.citizenId);
    const [t] = useTranslation('lang');

    return (
        <List>
            <CitizenInfoItem
                icon={<FaceIcon/>}
                label={t('Imię i nazwisko')}
                value={`${citizen.value?.Name || '...'} ${citizen.value?.Surname || '...'}`}
            />
            {!props.modeWanted && <CitizenInfoItem
                icon={<TodayIcon/>}
                label={t('Data urodzenia')}
                value={citizen.value?.BirthDate || '...'}
            />}
            {!props.modeWanted && <CitizenInfoItem
                icon={<HeightIcon/>}
                label={t('Wzrost')}
                value={citizen.value?.Height || '...'}
            />}
            {!props.modeWanted && <CitizenInfoItem
                icon={<PhoneAndroidIcon/>}
                label={t('Numer telefonu')}
                value={citizen.value?.PhoneNumber || '...'}
            />}
            {props.modeWanted && <CitizenInfoItem
                icon={<VisibilityIcon/>}
                label={t('Przewidywana kara')}
                value={!citizen.value ? '...' : <WantedSummary {...citizen.value} />}
            />}
        </List>
    );
}

export default CitizenInfo;
