import jwt from "jsonwebtoken";
import { tokenType } from "../constants";


//* 받아온 userId를 담는 access token 생성
const sign = (tableName: string, userId: number) => {
  const payload = {
    tableName,
    userId,
  };

  //! TO-DO : expiration 나중에 설정하기  -> 고정 토큰 하나 생성하기 위해 365d로 해둠 
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "365d" });  
  return accessToken;
};


//* token 검사!
const verify = (token: string) => {
  let decoded: string | jwt.JwtPayload;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error: any) {
    if (error.message === "jwt expired") {
      return tokenType.TOKEN_EXPIRED;
    } else if (error.message === "invalid token") {
      return tokenType.TOKEN_INVALID;
    } else {
      return tokenType.TOKEN_INVALID;
    }
  }
  
  return decoded;
};

export default {
  sign,
  verify,
};