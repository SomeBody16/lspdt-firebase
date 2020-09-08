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
            fontSize: '38px',
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
    const [t] = useTranslation('common');

    const snackbar = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);

    const setCitizenPhoto = useFunction<ISetCitizenPhotoProps, void>('setCitizenPhoto');

    const handleOnClick = React.useCallback(async () => {
        setAppBarProgress('indeterminate');

        const clipboardData: string = await navigator.clipboard.readText();

        const image = new Image();
        image.onerror = () => {
            snackbar.enqueueSnackbar(t('snackbar.notAnImageUrl'), {
                variant: 'error',
            });
            setAppBarProgress(null);
        };
        image.onload = () => {
            setCitizenPhoto({
                citizenId: props.citizenId,
                imageUrl: clipboardData,
            })
                .then(() => {
                    snackbar.enqueueSnackbar(t('snackbar.citizenImageSet'), {
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

        image.src = clipboardData;
    }, [setAppBarProgress, snackbar, t, setCitizenPhoto, props.citizenId]);

    React.useEffect(() => {
        const onPasteHandler = (pasteEvent: any) => {
            // consider the first item (can be easily extended for multiple items)
            var item = pasteEvent.clipboardData.items[0];

            if (item.type.indexOf('image') === 0) {
                var blob = item.getAsFile();

                var reader = new FileReader();
                reader.onload = async (event) => {
                    const res = event.target?.result;
                    console.log({ res });
                    if (res) {
                        await navigator.clipboard.writeText(res as string);
                        await handleOnClick();
                    }
                };

                reader.readAsDataURL(blob);
            }
        };
        document.addEventListener('paste', onPasteHandler);
        return () => document.removeEventListener('paste', onPasteHandler);
    }, [handleOnClick]);

    const imageSrc = citizen.value?.ImageUrl || '/images/no_photo_found.jpg';
    const citizenPhotoClassName = `${classes.citizenPhoto} ${
        citizen.value?.IsChief && classes.isChief
    }`;

    return (
        <div className={classes.root} onClick={handleOnClick}>
            <img className={citizenPhotoClassName} src={imageSrc} alt='' />
            {citizen.value?.IsWanted && (
                <Typography
                    style={{
                        fontSize: (t(
                            'citizen.details.wanted.onImageFontSize'
                        ) as unknown) as number,
                    }}
                    className={classes.isWanted}
                >
                    {t('citizen.details.wanted.label').toUpperCase()}
                </Typography>
            )}
            {citizen.value?.IsOfficer && <OfficerBadge {...props} />}
        </div>
    );
}

export default CitizenPhoto;
