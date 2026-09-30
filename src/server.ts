import app from "./app.js";

const port = process.env.PORT || 5050
const app_name = process.env.APP_NAME || 'carentoOasis'

app.listen(port, ()=>{
   console.log(`${app_name} started on Port ${port}`)
})