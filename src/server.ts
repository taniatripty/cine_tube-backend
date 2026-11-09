
import "dotenv/config";
import app from "./app"
import { seedAdmin } from "./app/utils/seed";


const port = process.env.PORT;


const startServer=async()=>{
  try {
    await seedAdmin();
    app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
    
  } catch (error) {
    console.error("failed to run", error)
    
  }
}

startServer();


