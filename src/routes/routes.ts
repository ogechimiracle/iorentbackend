import { Router} from "express";
import loginRouter from "../controller/auth/auth.routes.js";
import carRouter from "../controller/cars/cars.routes.js";
const router:Router = Router();

router.use('/auth', loginRouter);
router.use('/cars', carRouter)

export default router;