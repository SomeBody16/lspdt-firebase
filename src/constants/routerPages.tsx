import React from 'react';
import CitizenDetailsScreen from '../screens/Citizens/CitizenDetailsScreen';
import ArrestMandateScreen from '../screens/Citizens/ArrestMandateScreen';
import SetCitizenPhoneAction from '../components/Citizens/Details/buttonActinos/SetCitizenPhoneAction';
import RecruitCitizen from '../components/Citizens/Details/buttonActinos/RecruitCitizen';
import MakeCitizenRegistration from '../components/Citizens/Details/buttonActinos/MakeCitizenRegistration';

export interface IRouterPage {
    url: string;
    exact?: boolean;
    component: any;
}

const routerPages: IRouterPage[] = [
    {
        url: 'citizen/:citizenId/arrest-mandate',
        component: <ArrestMandateScreen />,
    },
    {
        url: 'citizen/:citizenId/action/set-phone-number',
        component: <SetCitizenPhoneAction />,
    },
    {
        url: 'citizen/:citizenId/action/make-registration',
        component: <MakeCitizenRegistration />,
    },
    {
        url: 'citizen/:citizenId/action/recruit',
        component: <RecruitCitizen />,
    },
    {
        url: 'citizen/:citizenId',
        component: <CitizenDetailsScreen />,
    },
];

export default routerPages;
