const jwt = require('jsonwebtoken');

const secret = 'secret';

const sign = (data: any) => {
    return jwt.sign({ ...data }, secret);
};

const decode = (token: any) => {
    if (token) {
        return { ...jwt.verify(token, secret) }
    }
    return undefined;
};


export { sign, decode };