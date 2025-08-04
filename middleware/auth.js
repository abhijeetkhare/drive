const jwt= require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.cookies.token ;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.Secretkey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
}
module.exports = auth;
