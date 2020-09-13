import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { CircularProgress } from '@material-ui/core';
import { IMakeSearchData } from '../../../screens/Citizens/SearchCitizensScreen';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: 150,
            display: 'flex',
            alignItems: 'center',
        },
        canvas: {
            border: '1px solid gold',
            borderRadius: '5px',
        },
        description: {
            display: 'flex',
            alignItems: 'center',
            marginLeft: theme.spacing(4),
        },
        progress: {
            marginRight: theme.spacing(1),
        },
    })
);

interface Props {
    status: string;
    idScan: HTMLImageElement | undefined;
    makeSearch: (data: IMakeSearchData) => void;
}

function IdScan(props: Props) {
    const classes = useStyles();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        props.idScan
            ? (ctx.globalAlpha = 0.1) &&
              ctx.drawImage(props.idScan, 0, 0, ctx.canvas.width, ctx.canvas.height)
            : ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const y = frameCount % (ctx.canvas.height + ctx.canvas.height * 0.1);

        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(ctx.canvas.width, y);
        ctx.stroke();
    };

    React.useEffect(() => {
        if (!canvasRef.current) return;
        const context = canvasRef.current.getContext('2d');
        if (!context) return;
        let frameCount = 0;
        let animationFrameId: number;

        context.fillStyle = 'rgba(0, 0, 0, 0.1)';
        context.strokeStyle = '#F00';

        const render = () => {
            frameCount++;
            draw(context, frameCount);
            animationFrameId = window.requestAnimationFrame(render);
        };
        render();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [draw]);

    return (
        <div className={classes.root}>
            {props.idScan && (
                <canvas
                    width='270px'
                    height='150px'
                    className={classes.canvas}
                    ref={canvasRef}
                ></canvas>
            )}
            <div className={classes.description}>
                <CircularProgress className={classes.progress} color='secondary' />
                <span>{props.status}</span>
            </div>
        </div>
    );
}

export default IdScan;
