import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(403).send('Login first');
        }

        console.log('Token received:', token);
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        // Fetch the full user document from the database
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        req.user = user; // Attach Mongoose document
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            res.clearCookie('token'); // Remove expired token from cookies
            return res.status(401).json({ error: "Session expired. Please log in again." });
        }

        
        else{
            console.error(err);
        return res.status(401).send('Invalid Token');
          }  }
};

export default auth;

