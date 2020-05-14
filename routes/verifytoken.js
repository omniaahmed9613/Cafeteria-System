const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {

    const token = req.header('auth-token')
    if (!token) {
        return res.status(401).send('access denied');
    }
    else {
        try {
            const verified = jwt.verify(token, process.env.token_secret);
            req.user = verified;
            next();
        }
        catch (error) { res.status.send('invalied token') }
    }
}
module.exports = auth;
//check