import React from 'react';

export interface IProviderWithProps {
    Provider: any;
    Props: any;
}

export interface IProvideProvidersProps {
    providers: IProviderWithProps[];
    children?: any;
}

function ProvideProviders(props: IProvideProvidersProps) {
    const providers = props.providers;
    const Provider = providers.pop();

    if (!Provider) {
        return props.children;
    }
    return (
        <Provider.Provider {...Provider.Props}>
            <ProvideProviders providers={providers}>{props.children}</ProvideProviders>
        </Provider.Provider>
    );
}

export default ProvideProviders;
