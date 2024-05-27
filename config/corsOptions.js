const allowedOrigins = [
    "https://user-credential-manager.netlify.app/",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
];

// remove !origin before deployment
export const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200,
};
