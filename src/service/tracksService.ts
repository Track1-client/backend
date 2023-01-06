import { PrismaClient } from "@prisma/client";
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { BeatCreateDTO, BeatClickedDTO, AllBeatDTO, CommentCreateDTO, AllCommentDTO } from '../interfaces/tracks';

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
            BeatFileDuration: {
                create: {
                    duration: await getAudioDurationInSeconds(wavLocation)
                }
            }
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

const getAllBeat = async(page: number, limit: number) => {

    const allBeatData = await prisma.beat.findMany({
        select: {
            id: true,
            beatImage: true,
            beatFile: true,
            title: true,
            keyword: true,
            category: true,
            producerId: true,
            BeatFileDuration: {
                select: {
                    duration: true
                }

            },
            Producer: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        skip: (page-1)*limit,
        take: limit,
    });
    
    
    const allBeats = await Promise.all(allBeatData.map(async (item, i) => {
        
        const beatReturn: AllBeatDTO = {
            beatId: item.id,
            jacketImage: item.beatImage,
            wavFile: item.beatFile,
            title: item.title,
            producerName: item.Producer.name,
            keyword: item.keyword,
            category: item.category,
            wavFileLength: item.BeatFileDuration?.duration as number
        };
        
        return beatReturn;
    }));
    return allBeats;
}

const getAllComment = async(beatId: number, userId: number, tableName: string, page: number, limit: number) => {

    //beatid에 해당하는 코멘트들 싹 가져오기
    //(코멘트고유id/보컬id/코멘트id/댓글wav파일/내용/재생길이
    const allCommentData = await prisma.comment.findMany({
        where:{
            beatId: beatId,
        },
        select:{
            id: true,
            beatId: true,
            vocalId: true,
            commentFile: true,
            content: true,
            CommentFileDuration: {
                select: {
                    duration: true
                }
            },
            Vocal: {    //! 요기서 바로가져오기 가능
                select: {
                    name: true,
                    vocalImage: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        skip: (page-1)*limit,
        take: limit,
    });

    const allComments = await Promise.all(allCommentData.map(async (item, i) => {
        //const crd = commentVocalData[i] as any;
        const isMe = (userId == item.vocalId) ? true: false;
        
        const commentReturn: AllCommentDTO = {
            commentId : item.id,
	        vocalWavFile : item.commentFile,
	        vocalName : item.Vocal.name,
            vocalProfileImage : item.Vocal.vocalImage,  //! 요렇게 사용
            comment : item.content || '',
            isMe : isMe,
            vocalWavFileLength : item.CommentFileDuration?.duration as number
        };
        
        return commentReturn;
    }));
    return allComments;
    
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

const postBeatComment = async(beatId: number, commentDTO: CommentCreateDTO, wavLocation: string)=> {

    const data = await prisma.comment.create({
        data: {
            beatId: beatId,
            vocalId: commentDTO.userId,
            commentFile: wavLocation,
            content:commentDTO.comment,
            CommentFileDuration: {
                create: {
                    duration: await getAudioDurationInSeconds(wavLocation)
                }
            }
        },
    });

    const createVocalOrder = await prisma.vocalOrder.create({
        data: {
            vocalId: commentDTO.userId,
            orderStandardTableName: 'comment',
            orderStandardTableId: data.id,
        }
    });

    return data;
};   

const getFilteredTracks = async(categList: string[], page: number, limit: number) => {

    //! 작업물 최신순 정렬
    const trackList = await prisma.beat.findMany({
        select:{
            id: true,
            beatImage: true,
            beatFile: true,
            title: true,
            Producer: {
                select: {
                    name: true,
                },
            },
            keyword: true,
            category: true,
            BeatFileDuration: {
                select: {
                    duration: true
                }
            },
        },
        where: {
            AND: [
            {category : { hasSome: categList }},
            {isClosed: false}
            ],
        },
        orderBy: {
            createdAt: 'desc',
        },
        distinct: ['id'],
        skip: (page-1)*limit,
        take: limit,
    });   

    const result = await Promise.all(trackList.map((track) => {

        const returnDTO:AllBeatDTO = {
            beatId: track.id,
            jacketImage: track.beatImage,
            wavFile: track.beatFile,
            title: track.title,
            producerName: track.Producer.name,
            keyword: track.keyword,
            category: track.category,
            wavFileLength: track.BeatFileDuration?.duration as number,
        }
        return returnDTO;
    }));

    return result;

};

const tracksService = {
    createBeat,
    getBeatLocation,
    getAllBeat,
    updateBeatClosed,
    getClickedBeat,
    postBeatComment,
    getAllComment,
    getFilteredTracks,
};

export default tracksService;