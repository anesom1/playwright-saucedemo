export type User = {
    username: string;
    password: string;
};

export const users = {
    standard: {
        username: 'standard_user',
        password: 'secret_sauce'
    },
    lockedOut: {
        username: 'locked_out_user',
        password: 'secret_sauce'
    }
} satisfies Record<string, User>;