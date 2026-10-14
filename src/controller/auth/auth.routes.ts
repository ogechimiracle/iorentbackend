import {Router} from "express";
const loginRouter:Router = Router();
import { authenticate } from "../../middleware/auth.middleware.js";

import {CreateUserController, LoginUserController} from "./auth.controller.js";

loginRouter.post('/create',authenticate, CreateUserController)
loginRouter.post('/login', LoginUserController)

export default loginRouter;