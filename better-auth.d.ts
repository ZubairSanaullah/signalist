declare module 'better-auth/next-js' {
    export const toNextJsHandler: (auth: any) => any;
}

declare module 'better-auth/api' {
    export const signInEmail: any;
}

declare module 'better-auth/react' {
    export const createAuthClient: (config: any) => any;
}

declare module 'inngest/next' {
    export const serve: any;
}
