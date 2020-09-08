import React from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useFunction } from '..';

export function useAllPermissionsHook(): {
    value: string[];
    isLoading: boolean;
} {
    const [t] = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const [permissions, setPermissions] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const listPermissions = useFunction<any, string[]>('listPermissions');

    React.useEffect(() => {
        setIsLoading(true);
        listPermissions()
            .then((permissions) => setPermissions(permissions || []))
            .finally(() => setIsLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enqueueSnackbar, t]);

    return {
        value: permissions,
        isLoading,
    };
}
