const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'VOTRE_SECRET_TEMPORAIRE');
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Authentification échouée'
        });
    }
};

module.exports = auth; 