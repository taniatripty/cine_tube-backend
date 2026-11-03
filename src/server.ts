
import "dotenv/config";
import app from "./app"

const port = process.env.PORT;


const startServer=async()=>{
  try {
  
    app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
    
  } catch (error) {
    console.error("failed to run", error)
    
  }
}

startServer();


