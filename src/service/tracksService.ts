import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from '../constants';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { BeatCreateDTO } from '../interfaces/tracks';
import { AllBeatDTO } from '../interfaces/tracks';

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
    
const getAllBeat = async() => {

    const allBeatData = await prisma.beat.findMany({
        select: {
            id: true,
            beatImage: true,
            beatFile: true,
            title: true,
            keyword: true,
            category: true,
            producerId: true
        }
    });
    //console.log(allBeatData);


    let producerNameData: object[] = [];

    for(const data of allBeatData) {
        const temp = await prisma.producer.findUnique({
            where: {
                id: data.producerId
            },
            select: {
                name: true
            }
        });

        producerNameData.push(temp as object);
    };

    
    const allBeats = allBeatData.map(async (item, i) => {

        const prd = producerNameData[i] as any;
        const wavefileLength = await getAudioDurationInSeconds(item.beatFile);
        
        const beatReturn: AllBeatDTO = {
            beatId: item.id,
            jacketImage: item.beatImage,
            wavFile: item.beatFile,
            title: item.title,
            producerName: prd['name'],
            keyword: item.keyword,
            category: item.category,
            wavFileLength: wavefileLength
        };
        
        console.log(beatReturn);
        return beatReturn;
    });
    
    return allBeats;
}


const tracksService = {
    createBeat,
    updateBeatClosed,
    getAllBeat,
};

export default tracksService;