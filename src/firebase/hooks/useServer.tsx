import React from 'react';
import { useClaims } from '..';

function useServer(): string | undefined {
    const [server, setServer] = React.useState<string>();

    const claims = useClaims();
    React.useEffect(() => {
        if (claims.isLoading) return;
        setServer(claims.value?.Server);
    }, [claims]);

    return server;
}

export default useServer;
