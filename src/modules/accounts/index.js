export { default as accountsRoutes } from './accounts.routes.js';

export {
    createAccount as createAccountService,
    getAccountsByUserId as getAccountsByUserIdService,
    getAccountByIdForUser as getAccountByIdForUserService,
    closeAccountForUser as closeAccountForUserService,
} from './accounts.service.js';