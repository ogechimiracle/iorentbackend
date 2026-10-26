
import { Router } from "express";
const carRouter:Router = Router()

import { CreateCarCategory, getAllCategory } from "./cars.controller";


carRouter.post('/create/category',CreateCarCategory)
carRouter.get('/categories', getAllCategory)


export default carRouter