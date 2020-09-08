declare module 'react-emojione' {
    export function emojify(str: string, options: any = {}): string;
}

declare namespace Intl {
    class RelativeTimeFormat {
        constructor(locale: string);

        format: (value: number, unit: string) => string;
    }
}
