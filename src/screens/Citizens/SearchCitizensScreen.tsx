import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { Stepper, Step, StepContent, StepLabel, StepButton } from '@material-ui/core';
import SearchResult from '../../components/Citizens/Search/SearchResult';
import SearchForm from '../../components/Citizens/Search/SearchForm';
import ICitizen from '../../../functions/src/models/citizen.interface';
import { useTranslation } from 'react-i18next';
import IdScan from '../../components/Citizens/Search/IdScan';
import firebase from 'firebase';
import AddCitizenForm from '../../components/Citizens/Search/AddCitizenForm';
import useServer from '../../firebase/hooks/useServer';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '100%',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
        },
    })
);

export type IMakeSearchData = {
    uuid?: string;
    name?: string;
    surname?: string;
    phoneNumber?: string;
    idContent?: {
        Name: string;
        Surname: string;
        BirthDate: string;
        Height: string;
    };
};

function SearchCitizensScreen() {
    const classes = useStyles();
    const [t] = useTranslation('lang');
    const [activeStep, setActiveStep] = React.useState(0);
    const Server = useServer();

    const [status, setStatus] = React.useState<string>('');
    const [idScan, setIdScan] = React.useState<HTMLImageElement>();

    const [searchResult, setSearchResult] = React.useState<ICitizen[]>([]);
    const [makeSearchData, setMakeSearchData] = React.useState<IMakeSearchData>();

    const makeSearch = async (data: IMakeSearchData) => {
        setMakeSearchData(data);
        setActiveStep(1);
        setStatus(t('Sprawdzanie bazy danych'));

        firebase.analytics().logEvent('citizen_search', data);

        let query = firebase
            .firestore()
            .collection('citizens')
            .where('Server', '==', Server || 'dev')
            .limit(10);
        if (data.phoneNumber) {
            query = query.where('PhoneNumber', '==', data.phoneNumber);
        } else {
            query = query.where('Name', '==', data.name).where('Surname', '==', data.surname);
        }

        const result = await query.get();
        const citizens = result.docs.map(
            (d) =>
                ({
                    ...d.data(),
                    Id: d.id,
                } as ICitizen)
        );

        setSearchResult(citizens);
        setActiveStep(2);
    };

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation='vertical'>
                <Step>
                    <StepButton onClick={() => setActiveStep(0)}>{t('Dane')}</StepButton>
                    <StepContent>
                        <SearchForm {...{ setStatus, setIdScan, setActiveStep, makeSearch }} />
                    </StepContent>
                </Step>
                <Step>
                    <StepLabel>{t('Wyszukiwanie')}</StepLabel>
                    <StepContent>
                        <IdScan {...{ status, idScan, makeSearch }} />
                    </StepContent>
                </Step>
                <Step>
                    <StepLabel>{t('Wyniki')}</StepLabel>
                    <StepContent>
                        {searchResult.length > 0 ? (
                            <SearchResult {...{ searchResult }} />
                        ) : (
                            <AddCitizenForm {...{ makeSearchData, idScan }} />
                        )}
                    </StepContent>
                </Step>
            </Stepper>
        </div>
    );
}

export default SearchCitizensScreen;
