import jwt from "jsonwebtoken";

export const verifyJWT = (token) => {
    try {
        // Verify and decode the JWT token using the provided secret
        return jwt.verify(token, "jwt-secret");
    } catch (err) {
        // Handle unauthorized access with a 401 status and appropriate message
        return false;
    }
};
