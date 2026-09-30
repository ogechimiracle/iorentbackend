import express, {type Express} from 'express'
import cors from 'cors'
const app:Express = express()
import router from './routes/routes.js'

app.use(express.json())
app.use(cors({
   origin: "http://localhost:3000",
   credentials:true,
}))

app.get('/', (req, res)=>{
   res.json({
      message:"Express app started successfully",
      status:200
   })
})
app.use('/api/v1', router)

export default app;