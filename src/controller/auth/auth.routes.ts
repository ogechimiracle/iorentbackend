import {Router} from "express";
const loginRouter:Router = Router();

import {CreateUserController, LoginUserController} from "./auth.controller.js";

loginRouter.post('/create', CreateUserController)
loginRouter.post('/login', LoginUserController)

export default loginRouter;