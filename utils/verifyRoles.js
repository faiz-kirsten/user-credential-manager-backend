export const verifyRoles = (userRoles, allowedRoles) => {
    let valid = false;

    if (userRoles.includes(allowedRoles[0])) {
        valid = true;
    }
    if (userRoles.includes(allowedRoles[1])) {
        valid = true;
    }
    if (userRoles.includes(allowedRoles[2])) {
        valid = true;
    }

    return valid;
};
