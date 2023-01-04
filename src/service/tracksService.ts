import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from '../constants';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { BeatCreateDTO, BeatClickedDTO, AllBeatDTO } from '../interfaces/tracks';

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

const getBeatLocation = async(beatId: number) => {
    
    const data = await prisma.beat.findUnique({
        where: {
            id: beatId,
        },
        select: {
            id: true,
            beatFile: true,
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

    
    const allBeats = allBeatData.map((item, i) => {

        const prd = producerNameData[i] as any;
        //const wavFileLength = getAudioDurationInSeconds(item.beatFile);
        
        const beatReturn: AllBeatDTO = {
            beatId: item.id,
            jacketImage: item.beatImage,
            wavFile: item.beatFile,
            title: item.title,
            producerName: prd['name'],
            keyword: item.keyword,
            category: item.category,
            //wavFileLength: wavFileLength
        };
        
        console.log(beatReturn);
        return beatReturn;
    });

    return allBeats;
}

const updateBeatClosed = async(beatId: number) => {
    const isClosedBeat = await prisma.beat.findUnique({
        where: {
            id: beatId,
        },
        select: {
            isClosed: true,
        }
    });

    const changeIsClosed = isClosedBeat ? false: true;
    const data = await prisma.beat.update({
        where: {
            id: beatId,
        },
        data: {
            isClosed: changeIsClosed,
        },
    });
    
    return data;
};
    
const getClickedBeat = async(beatId: number, userId: number, tableName: string) => {
  const beatData = await prisma.beat.findUnique({
    where: { id: beatId }
  });

  if (!beatData) return null;

  const producerData = await prisma.producer.findUnique({
    where: { id: beatData.producerId },
    select: {
      name: true,
      producerImage: true,
      id: true,
    }
  });

  if (!producerData) return null;

  const isMe = (userId === producerData?.id) ? true: false;
  const wavefileLength = await getAudioDurationInSeconds(beatData.beatFile);

  const getClickBeatReturn: BeatClickedDTO = {

    beatId: beatData.id,
    jacketImage: beatData.beatImage,
    beatWavFile: beatData.beatFile,
    title: beatData.title,
    producerName: producerData.name,
    producerProfileImage: producerData.producerImage,
    introduce: beatData.introduce || '',
    keyword: beatData.keyword,
    category: beatData.category,
    isMe: isMe as boolean,
    wavFileLength: wavefileLength,
    isClosed: beatData.isClosed,

  }

  return getClickBeatReturn;

}


const tracksService = {
    createBeat,
    getBeatLocation,
    getAllBeat,
    updateBeatClosed,
    getClickedBeat,
};

export default tracksService;