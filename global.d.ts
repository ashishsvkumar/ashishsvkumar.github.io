declare module '*.scss' {
    const content: any;
    export = content;
}

declare module "@storybook/addon-actions" {
    export function action(name: string, ...params: any[]): any;
}

declare module "@storybook/addon-knobs" {
    export function text(label: string, value: string): any;
    export function number(label: string, value: number): any;
    export function boolean(label: string, value: boolean): any;
}

declare module "@storybook/addon-links" {
    export function linkTo(name: string, ...params: any[]): any;
}

declare module "@storybook/addon-backgrounds" {
    export function withBackgrounds(param: any): any;
}
