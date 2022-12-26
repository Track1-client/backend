import express, { NextFunction, Request, Response } from "express";
import router from "./router";

const app = express();
const PORT = 3000; 

app.use(express.json());
app.use("/", router); 

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Track-1 SERVER OPEN!!");
});

app.listen(PORT, () => {
  console.log(`
        #############################################
            🛡️ Server listening on port: ${PORT} 🛡️
        #############################################
    `);
}); // 8000 번 포트에서 서버를 실행하겠다!