import app from "./src/app.js";
import connectDB from "./src/config/database.js";

connectDB();
const port = 3000|| 8000;

app.listen(port,(req,res)=>{
      console.log(`server is runnig on ${port}`)
})