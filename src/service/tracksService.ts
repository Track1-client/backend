import { PrismaClient } from "@prisma/client";
import { BeatCreateDTO, AllBeatDTO } from '../interfaces/tracks';
import { getAudioDurationInSeconds } from 'get-audio-duration';

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
        //const beatObject = Object.assign({}, item, producerNameData[i]);
        const prd = producerNameData[i] as any;
        const wavefileLength = getAudioDurationInSeconds(item.beatFile);
        const a = getAudioDurationInSeconds(item.beatFile).then((duration) => {
            return duration;
        });
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
    getBeatLocation,
    getAllBeat,
};

export default tracksService;