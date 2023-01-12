import express, { NextFunction, Request, Response,  } from "express";
import router from "./router";
import cors from "cors";
import { globalErrorHandler } from './middlewares/error';

const app = express();
const PORT = 3000; 

const corsOriginList = [
  'http://localhost:3000',
  'http://3.37.69.246:3000',  
  'https://www.track1.site'
];
const corsOptions = {
  origin: corsOriginList,
  credential: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  const origin: string = req.headers.origin as string;
  if (corsOriginList.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, content-type, x-access-token',
  );
  next();
});



app.use(express.json());
app.use("/", router); 
app.use(globalErrorHandler);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Track-1 SERVER OPEN!!");
});


app.listen(PORT, () => {
  console.log(`
        #############################################
            🛡️ Server listening on port: ${PORT} 🛡️
        #############################################
    `);
}); 

export default app;