import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { Box, Typography } from '@material-ui/core';
import Button, { ButtonProps } from '@material-ui/core/Button';
import CircularProgress, { CircularProgressProps } from '@material-ui/core/CircularProgress';

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
    return (
        <Box position='relative' display='inline-flex'>
            <CircularProgress variant='static' {...props} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position='absolute'
                display='flex'
                alignItems='center'
                justifyContent='center'
            >
                <Typography variant='caption' component='div' color='textSecondary'>{`${Math.round(
                    props.value
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            position: 'relative',
        },
        progress: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
        },
    })
);

export interface SubmitButtonProps extends ButtonProps {
    className?: string;
    children: any;
}

export type SubmitButtonCallback = (
    setProgress: React.Dispatch<React.SetStateAction<number | undefined>>
) => Promise<any>;

function useSubmitButton(): [
    (props: SubmitButtonProps) => JSX.Element,
    React.Dispatch<React.SetStateAction<boolean>>,
    React.Dispatch<React.SetStateAction<number | undefined>>
] {
    const classes = useStyles();

    const [loading, setLoading] = React.useState<boolean>(false);
    const [progressValue, setProgressValue] = React.useState<number | undefined>(undefined);

    const Progress = React.useCallback(
        ({ color }: any) =>
            progressValue === undefined ? (
                <CircularProgress color={color} className={classes.progress} size={24} />
            ) : (
                <CircularProgressWithLabel
                    color={color}
                    value={progressValue}
                    className={classes.progress}
                    size={24}
                />
            ),
        [classes.progress, progressValue]
    );

    const SubmitButton = React.useCallback(
        (props: SubmitButtonProps) => (
            <Button
                type='submit'
                variant='contained'
                color='primary'
                {...props}
                className={`${classes.button} ${props.className}`}
                startIcon={loading && <Progress color='secondary' />}
                disabled={loading || props.disabled}
            >
                {props.children}
            </Button>
        ),
        [classes.button, loading]
    );

    return [SubmitButton, setLoading, setProgressValue];
}

export default useSubmitButton;
