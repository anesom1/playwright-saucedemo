export type Message = {
    msg: string;
};

export const messages = {
    wrongCredentials: {
        msg: 'Epic sadface: Username and password do not match any user in this service'
    },
    lockedOut: {
        msg: 'Epic sadface: Sorry, this user has been locked out.'
    },
    notLoggedIn: {
        msg: 'Epic sadface: You can only access \'/inventory.html\' when you are logged in.'
    },
    usernameRequired: {
        msg: 'Epic sadface: Username is required'
    }

} satisfies Record<string, Message>;