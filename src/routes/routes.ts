import { Router} from "express";
import loginRouter from "../controller/auth/auth.routes.js";
const router:Router = Router();

router.use('/auth', loginRouter);

export default router;