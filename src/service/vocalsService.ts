import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from '../constants';

const prisma = new PrismaClient();

const getVocals = async() => {

    //! 작업물 최신순 정렬
    
};

const vocalsService = {
    getVocals,
};

export default vocalsService;