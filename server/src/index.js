import 'dotenv/config';  // dotenv handles this differently in ESM
import connectDB from './db/index.js';
import app from './app.js';
import checkAndUnlockCapsules from "./utils/unlockCapsules.js";

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 5000, ()=>{
        console.log(`Server is running at port: ${process.env.PORT}`);

        checkAndUnlockCapsules();
        
        setInterval(checkAndUnlockCapsules, 24 * 60 * 60 * 1000);
    })
})
.catch((err)=>{
    console.log("Mongo DB Connection Failed!!! ", err);
});