import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { useCitizen, useFunction } from '../../../firebase';
import { useOfficerByCitizenId } from '../../../firebase';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { AppBarProgressContext } from '../../DrawerContainer/DrawerContainer';
import { useSnackbar } from 'notistack';
import { ISetCitizenPhotoProps } from '../../../../functions/src/callable/citizen/setCitizenPhoto';
import useFivemBridge from '../../../hooks/useFivemBridge';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'relative',
        },
        citizenPhoto: {
            width: '100%',
            borderRadius: '4px',
            cursor: 'pointer',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.palette.divider,
        },
        isWanted: {
            position: 'absolute',
            bottom: theme.spacing(1),
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'red',
            fontWeight: 'bold',
            fontSize: '32px',
            textShadow: '0 0 5px black',
        },
        isOfficer: {
            position: 'absolute',
            top: theme.spacing(1),
            left: theme.spacing(1),
            width: theme.spacing(4),
            filter: 'drop-shadow(0px 0px 5px black)',
        },
        isChief: {
            boxShadow: '0 0 10px gold',
        },
    })
);

interface Props {
    citizenId: string;
}

function OfficerBadge(props: Props) {
    const classes = useStyles();

    const officer = useOfficerByCitizenId(props.citizenId);
    const rankImageUrl = officer.value?.Rank?.ImageUrl;
    return <img className={classes.isOfficer} src={rankImageUrl} alt='' />;
}

function CitizenPhoto(props: Props) {
    const classes = useStyles();
    const citizen = useCitizen(props.citizenId);
    const [t] = useTranslation('lang');

    const snackbar = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);

    const setCitizenPhoto = useFunction<ISetCitizenPhotoProps, void>('setCitizenPhoto');

    const fivemBridge = useFivemBridge();
    React.useEffect(() => {
        return fivemBridge.onPasteImage(async (src) => {
            setAppBarProgress('indeterminate');

            const image = new Image();
            image.onerror = () => {
                snackbar.enqueueSnackbar(t('W schowku nie znaleziono zdjęcia!'), {
                    variant: 'error',
                });
                setAppBarProgress(null);
            };
            image.onload = () => {
                setCitizenPhoto({
                    citizenId: props.citizenId,
                    imageUrl: src,
                })
                    .then(() => {
                        snackbar.enqueueSnackbar(t('Zmieniono zdjęcie obywatela!'), {
                            variant: 'success',
                        });
                    })
                    .catch((err) => {
                        snackbar.enqueueSnackbar(t(err.message, err.details), {
                            variant: 'error',
                        });
                    })
                    .finally(() => setAppBarProgress(null));
            };

            image.src = src;
        });
    }, [fivemBridge, props.citizenId, setAppBarProgress, setCitizenPhoto, snackbar, t]);

    const imageSrc = citizen.value?.ImageUrl || '/images/no_photo_found.jpg';
    const citizenPhotoClassName = `${classes.citizenPhoto} ${
        citizen.value?.IsChief && classes.isChief
    }`;

    return (
        <div
            className={classes.root}
            onClick={async () =>
                fivemBridge.triggerEvent('pasteImage', await navigator.clipboard.readText())
            }
        >
            <img className={citizenPhotoClassName} src={imageSrc} alt='' />
            {citizen.value?.IsWanted && (
                <Typography className={classes.isWanted}>
                    {t('Poszukiwany').toUpperCase()}
                </Typography>
            )}
            {citizen.value?.IsOfficer && <OfficerBadge {...props} />}
        </div>
    );
}

export default CitizenPhoto;
