import React from 'react';
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
    LinearProgress,
} from '@material-ui/core';
import { useCitizenRegistry } from '../../../firebase';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IRegistration from '../../../../functions/src/models/registration.interface';
import { useTranslation } from 'react-i18next';
import OfficerChip from '../../Chips/OfficerChip';
import DateTimeChip from '../../Chips/DateTimeChip';
import EmojiPrefix from '../../Chips/EmojiPrefix';
import CrimeChip from '../../Chips/CrimeChip';
import { penaltyStr, judgmentStr } from '../../Chips/PenaltyJudgment';

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

interface Props {
    citizenId: string;
}

interface IRegistryItemProps {
    item: IRegistration;
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<string | false>>;
}

function RegistryItem(props: IRegistryItemProps) {
    const classes = useStyles();
    const useTranslationResponse = useTranslation('lang');
    const [t] = useTranslationResponse;
    const handleChange = (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        props.setExpanded(isExpanded ? props.item.Id : false);
    };

    const titleProps = {
        penalty: !props.item.Crimes
            ? 0
            : penaltyStr(
                  props.item.Crimes.reduce((prev, curr) => prev + curr.Penalty, 0),
                  useTranslationResponse
              ),
        judgment: !props.item.Crimes
            ? 0
            : judgmentStr(
                  props.item.Crimes.reduce((prev, curr) => prev + curr.Judgment, 0),
                  useTranslationResponse
              ),
    };

    return (
        <Accordion
            expanded={props.expanded}
            onChange={handleChange}
            TransitionProps={{ unmountOnExit: true }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{t(props.item.Title, titleProps)}</Typography>
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
                        <CrimeChip key={Date.now()} {...crime} />
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
                />
            ))}
        </div>
    );
}

export default CitizenRegistry;
