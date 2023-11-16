export const errorMessages = {
    DUPLICATE_NAME: (name: string) => `User name ${name} already exists`,
    DUPLICATE_EMAIL: (email: string) => `User email ${email} already exists`,
    INVALID_LOGIN_CREDENTIALS: `Forbidden. Access to this resource on the server is denied!`,
    DELETE_OLD_LOGOUT_TOKENS_ERROR: `Error deleting old logout tokens`,
};