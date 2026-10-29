
import { Router } from "express";
const carRouter:Router = Router()

import { CreateCarCategory, getAllCategory, CreateCarMakes, getAllCarMake } from "./cars.controller";


carRouter.post('/create/category',CreateCarCategory)
carRouter.get('/categories', getAllCategory)
carRouter.post('/create/make', CreateCarMakes)
carRouter.get('/make', getAllCarMake)


export default carRouter