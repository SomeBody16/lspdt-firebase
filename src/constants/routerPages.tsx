import React from 'react';
import CitizenDetailsScreen from '../screens/Citizens/CitizenDetailsScreen';
import ArrestMandateScreen from '../screens/Citizens/ArrestMandateScreen';

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
        url: 'citizen/:citizenId',
        component: <CitizenDetailsScreen />,
    },
];

export default routerPages;
