import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { useAuthChanged } from '../../firebase';
import theme from '../../constants/theme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { DrawerItems, DrawerItemsRouter } from '../../constants/drawerItems';
import { useTranslation } from 'react-i18next';
import { LinearProgress } from '@material-ui/core';

const drawerWidth = 200;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: '100vh',
            width: '100%',
        },
        drawer: {
            [theme.breakpoints.up('sm')]: {
                width: drawerWidth,
                flexShrink: 0,
            },
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        title: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        drawerPaper: {
            width: drawerWidth,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
        drawerItemsRouter: {
            display: 'flex',
            flex: 1,
        },
    })
);

function MobileContainer(props: any) {
    return (
        <Drawer
            variant='temporary'
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={props.mobileOpen}
            onClose={props.handleDrawerToggle}
            classes={{
                paper: props.drawerPaperClassName,
            }}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
        >
            {props.children}
        </Drawer>
    );
}

function TabletContainer(props: any) {
    return (
        <Drawer
            classes={{
                paper: props.drawerPaperClassName,
            }}
            variant='permanent'
            open
        >
            {props.children}
        </Drawer>
    );
}

type AppBarProgressContextValue = React.Dispatch<
    React.SetStateAction<number | 'indeterminate' | null>
>;
export const AppBarProgressContext = React.createContext<AppBarProgressContextValue>(() => {});

function DrawerContainer(props: any) {
    const classes = useStyles();
    const user = useAuthChanged();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [t] = useTranslation('common');

    const [loadingProgress, setLoadingProgress] = React.useState<number | 'indeterminate' | null>(
        null
    );

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
    const Container = isMobile ? MobileContainer : TabletContainer;

    return (
        <div className={classes.root}>
            <AppBar position='fixed' className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        edge='start'
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant='h5' noWrap className={classes.title}>
                        {t('app.title')}
                    </Typography>

                    <Hidden xsDown>
                        <Typography variant='h6'>
                            {!isMobile && user && user.displayName}
                        </Typography>
                    </Hidden>
                </Toolbar>
                {loadingProgress && (
                    <LinearProgress
                        color='secondary'
                        variant={
                            typeof loadingProgress === 'number' ? 'determinate' : 'indeterminate'
                        }
                        value={typeof loadingProgress === 'number' ? loadingProgress : 0}
                    />
                )}
            </AppBar>
            <nav className={classes.drawer}>
                <Container
                    mobileOpen={mobileOpen}
                    handleDrawerToggle={handleDrawerToggle}
                    drawerPaperClassName={classes.drawerPaper}
                >
                    <Hidden xsDown>
                        <div className={classes.toolbar} />
                        <Divider />
                    </Hidden>
                    <DrawerItems />
                </Container>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <AppBarProgressContext.Provider value={setLoadingProgress}>
                    <DrawerItemsRouter />
                </AppBarProgressContext.Provider>
            </main>
        </div>
    );
}

export default DrawerContainer;
