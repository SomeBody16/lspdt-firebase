import React, {useCallback, useState} from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    AccordionActions,
    Divider,
    Button,
    LinearProgress, Menu, MenuItem, withStyles, MenuProps,
} from '@material-ui/core';
import {useCitizen, useCitizenRegistry, useClaims, useFunction} from '../../../firebase';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IRegistration from '../../../../functions/src/models/registration.interface';
import { useTranslation } from 'react-i18next';
import OfficerChip from '../../Chips/OfficerChip';
import DateTimeChip from '../../Chips/DateTimeChip';
import EmojiPrefix from '../../Chips/EmojiPrefix';
import CrimeChip from '../../Chips/CrimeChip';
import { penaltyStr, judgmentStr } from '../../Chips/PenaltyJudgment';
import {useParams} from "react-router-dom";
import {crimeRecidivism} from "../ArrestMandate/ArrestCrimesList";
import {IRemoveRegistrationProps} from "../../../../functions/src/callable/citizen/removeRegistration";
import {useSnackbar} from "notistack";
import {AppBarProgressContext} from "../../DrawerContainer/DrawerContainer";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        accordionActions: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        prefixes: {
            marginLeft: 'auto',
        },
        registrationImage: {
            width: '100%',
            borderRadius: '4px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.palette.divider,
        },
        crimes: {
            display: 'block',
        },
        pagination: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
        },
    })
);


const StyledMenu = withStyles({
    paper: {
        border: '1px solid red',
    },
})((props: MenuProps) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

interface Props {
    citizenId: string;
}

interface IRegistryItemProps {
    item: IRegistration;
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<string | false>>;
    handleOpenMenu: (event: React.MouseEvent<HTMLElement>, registrationId: string) => void;
}

function RegistryItem(props: IRegistryItemProps) {
    const classes = useStyles();
    const useTranslationResponse = useTranslation('lang');
    const [t] = useTranslationResponse;
    const handleChange = (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        props.setExpanded(isExpanded ? props.item.Id : false);
    };

    const { citizenId } = useParams() as any;
    const citizen = useCitizen(citizenId);

    const titleProps = {
        penalty: !props.item.Crimes
            ? 0
            : penaltyStr(
                  props.item.Crimes.reduce((prev, curr) => prev + crimeRecidivism(curr, curr.Penalty, citizen.value, 0.5), 0),
                  useTranslationResponse
              ),
        judgment: !props.item.Crimes
            ? 0
            : judgmentStr(
                  props.item.Crimes.reduce((prev, curr) => prev + crimeRecidivism(curr, curr.Judgment, citizen.value, 1.0), 0),
                  useTranslationResponse
              ),
    };

    let title = props.item.Title;
    if (title === '{{penalty}} | {{judgment}}') {
        title = props.item.Crimes?.reduce((prev, curr) => prev + crimeRecidivism(curr, curr.Judgment, citizen.value, 1.0), 0)
            ? 'Odsiadka'
            : 'Mandat';
    }

    return (
        <Accordion
            expanded={props.expanded}
            onChange={handleChange}
            TransitionProps={{ unmountOnExit: true }}
            onContextMenu={e => props.handleOpenMenu(e, props.item.Id)}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{t(title, titleProps)}</Typography>
                <Typography className={classes.prefixes}>
                    {props.item.Prefixes.map((item) => (
                        <EmojiPrefix key={item.Content} size={24} prefix={item} />
                    ))}
                </Typography>
            </AccordionSummary>
            {props.item.Description && (
                <AccordionDetails>
                    <Typography>{t(props.item.Description)}</Typography>
                </AccordionDetails>
            )}
            {props.item.Crimes && (
                <AccordionDetails className={classes.crimes}>
                    {props.item.Crimes.map((crime) => (
                        <CrimeChip key={crime.Id} {...crime} />
                    ))}
                </AccordionDetails>
            )}
            {props.item.ImageUrl && (
                <AccordionDetails>
                    <img className={classes.registrationImage} src={props.item.ImageUrl} alt='' />
                </AccordionDetails>
            )}
            <Divider />
            <AccordionActions className={classes.accordionActions}>
                <DateTimeChip template='registration'>{props.item.CreateTime}</DateTimeChip>
                <OfficerChip officer={props.item.OfficerAuthor} />
            </AccordionActions>
        </Accordion>
    );
}

function CitizenRegistry(props: Props) {
    const classes = useStyles();
    const { registry, currentPage, prevPage, nextPage, isLoading } = useCitizenRegistry(
        props.citizenId
    );
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [t] = useTranslation('common');
    const { enqueueSnackbar } = useSnackbar();

    const setAppBarProgress = React.useContext(AppBarProgressContext);
    const removeRegistration = useFunction<IRemoveRegistrationProps, void>('removeRegistration');
    const claims = useClaims();
    const [handleRemoveItem, setHandleRemoveItem] = useState<() => void>(() => null)
    const canRemoveRegistration = claims.value?.admin || claims.value?.permissions?.includes('removeRegistration');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLElement>, registrationId: string) => {
        if (canRemoveRegistration) {
            setAnchorEl(event.currentTarget);
            event.preventDefault();

            setHandleRemoveItem(() => () => {
                setAppBarProgress("indeterminate")
                removeRegistration({
                    registrationId,
                    citizenId: props.citizenId,
                })
                    .then(() => enqueueSnackbar('Usunięto!', { variant: 'success' }))
                    .finally(() => {
                        setAppBarProgress(null);
                    })
            });
        }
    }, [canRemoveRegistration, enqueueSnackbar, props.citizenId, removeRegistration, setAppBarProgress]);
    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.pagination}>
                <Button disabled={isLoading} onClick={prevPage}>
                    {t('Poprzednie')}
                </Button>
                {currentPage}
                <Button disabled={isLoading} onClick={nextPage}>
                    {t('Następne')}
                </Button>
            </div>
            {isLoading && <LinearProgress color='secondary' />}

            {registry.map((item) => (
                <RegistryItem
                    key={item.Id}
                    item={item}
                    expanded={expanded === item.Id}
                    setExpanded={setExpanded}
                    handleOpenMenu={handleOpenMenu}
                />
            ))}

            <StyledMenu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleRemoveItem}>Usuń</MenuItem>
            </StyledMenu>
        </div>
    );
}

export default CitizenRegistry;
