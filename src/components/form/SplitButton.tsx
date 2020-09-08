import React from 'react';
import {
    ButtonGroup,
    Button,
    Popper,
    Grow,
    Paper,
    ClickAwayListener,
    MenuList,
    MenuItem,
    makeStyles,
    Theme,
    createStyles,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

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

export interface ISplitButtonOption {
    label: string;
    action: () => void;
    show?: boolean;
}

interface Props {
    options: ISplitButtonOption[];
}

function SplitButton({ options }: Props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const buttonContainerRef = React.useRef<HTMLDivElement>(null);

    const handleClick = () => {
        options[selectedIndex].action();
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
                    {options[selectedIndex].label}
                </Button>
                <Button
                    color='primary'
                    size='small'
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label='select merge strategy'
                    aria-haspopup='menu'
                    onClick={handleToggle}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                style={{
                    width: buttonContainerRef.current?.offsetWidth,
                }}
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
                                    {options
                                        .filter((o) => o.show)
                                        .map((option, index) => (
                                            <MenuItem
                                                key={option.label}
                                                selected={index === selectedIndex}
                                                onClick={(event) =>
                                                    handleMenuItemClick(event, index)
                                                }
                                            >
                                                {option.label}
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

export default SplitButton;
