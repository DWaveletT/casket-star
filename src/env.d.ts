declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module "*.png" {
    const value: string;
    export default value;
}

declare global {
    interface Window {
        _feInstance: unknown;
        _feRouter: unknown;
    }
}

declare module 'lodash-es'