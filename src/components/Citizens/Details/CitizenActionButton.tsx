import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import {
    Button,
    ButtonGroup,
    Popper,
    Grow,
    Paper,
    ClickAwayListener,
    MenuList,
    MenuItem,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import ICitizen from '../../../../functions/src/models/citizen.interface';
import { useClaims, useCitizen } from '../../../firebase';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        buttonGroup: {
            width: '100%',
        },
        actionButton: {
            flex: 1,
        },
    })
);

interface IActionOption {
    text: string;
    url: string;
    permission: string;
    showIf?: (citizen: ICitizen | undefined) => boolean;
}

const actionOptions: IActionOption[] = [
    {
        text: 'citizen.action.arrestMandate',
        url: '/arrest-mandate',
        permission: 'accessArrestMandate',
    },
    {
        text: 'citizen.details.phoneNumber',
        // callback: () => true,
        url: '/action/set-phone-number',
        permission: 'setCitizenPhoneNumber',
    },
    {
        text: 'citizen.action.recruit',
        url: '/action/recruit',
        permission: 'recruitOfficer',
        showIf: (citizen) => !citizen?.IsOfficer,
    },
    {
        text: 'citizen.action.insertRegistry',
        url: '/action/make-registration',
        permission: 'makeCitizenRegistration',
    },
];

interface Props {
    citizenId: string;
}

function CitizenActionButton(props: Props) {
    const [t] = useTranslation('common');
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const buttonContainerRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const history = useHistory();

    const claims = useClaims();
    const citizen = useCitizen(props.citizenId);

    const options = actionOptions
        .filter((o) => claims.value?.admin || claims.value?.permissions?.includes(o.permission))
        .filter((o) => (o.showIf ? o.showIf(citizen.value) : true))
        .map((o) => o.text);

    const handleClick = () => {
        const option = actionOptions.find((o) => o.text === options[selectedIndex]);
        option && citizen && history.push(citizen.value?.Id + option.url);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number
    ) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    return (
        <div className={classes.buttonGroup} ref={buttonContainerRef}>
            <ButtonGroup
                className={classes.buttonGroup}
                variant='contained'
                color='primary'
                ref={anchorRef}
                aria-label='split button'
            >
                <Button className={classes.actionButton} onClick={handleClick}>
                    {t(options[selectedIndex])}
                </Button>
                <Button
                    color='primary'
                    size='small'
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup='menu'
                    onClick={handleToggle}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper
                style={{
                    width: buttonContainerRef.current?.offsetWidth,
                }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id='split-button-menu'>
                                    {options.map((option, index) => (
                                        <MenuItem
                                            key={option}
                                            selected={index === selectedIndex}
                                            onClick={(event) => handleMenuItemClick(event, index)}
                                        >
                                            {t(option)}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
}

export default CitizenActionButton;
