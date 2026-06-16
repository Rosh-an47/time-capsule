import 'dotenv/config';  // dotenv handles this differently in ESM
import connectDB from './db/index.js';
import app from './app.js';

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port: ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Mongo DB Connection Failed!!! ", err);
});