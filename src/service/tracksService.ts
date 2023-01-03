import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from '../constants';
import { BeatCreateDTO } from '../interfaces/tracks';

const prisma = new PrismaClient();

const createBeat = async(beatDTO: BeatCreateDTO, jacketLocation: string, wavLocation: string) => {

    const data = await prisma.beat.create({
        data: {
            title: beatDTO.title,
            category: beatDTO.category,
            beatFile: wavLocation,
            beatImage: jacketLocation,
            introduce: beatDTO.introduce,
            keyword: beatDTO.keyword,
            producerId: beatDTO.userId,
            isClosed: false,
        },
    });

    return data;
};

const updateBeatClosed = async(beatId: number) => {
    const data = await prisma.beat.update({
        where: {
          id: beatId,
        },
        data: {
          isClosed: true,
        },
      });
    
      return data;
    };
    


const tracksService = {
    createBeat,
    updateBeatClosed,
};

export default tracksService;