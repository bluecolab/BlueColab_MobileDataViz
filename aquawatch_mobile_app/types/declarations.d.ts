// declarations.d.ts
declare module '*.ttf' {
    const content: string;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module 'react-native-wagmi-charts' {
    import type { ComponentType } from 'react';

    export const CartesianChart: ComponentType<any>;
    export const AreaRange: ComponentType<any>;
    export const Line: ComponentType<any>;
}
