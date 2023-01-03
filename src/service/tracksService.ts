import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from '../constants';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { BeatCreateDTO, BeatClickedDTO } from '../interfaces/tracks';

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
    updateBeatClosed,
    getClickedBeat,
};

export default tracksService;