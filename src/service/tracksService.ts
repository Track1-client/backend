import { ResultNotFound } from './../middlewares/error/constant/resultNotFound';
import { PrismaClient } from "@prisma/client";
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { BeatCreateDTO, BeatClickedDTO, AllBeatDTO, CommentCreateDTO, AllCommentDTO } from '../interfaces/tracks';
import { rm } from '../constants';
import { InvalidBeatIdError } from '../middlewares/error/constant';

const prisma = new PrismaClient();

const createBeat = async(beatDTO: BeatCreateDTO, jacketLocation: string, wavLocation: string) => {
    try {

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

        if ( !data ) throw new ResultNotFound(rm.BEAT_UPLOAD_FAIL);
        return data;
    } catch (error) {
        throw error;
    }
};

const getBeatLocation = async(beatId: number) => {
    try {

        const data = await prisma.beat.findUnique({
            where: {
                id: beatId,
            },
            select: {
                id: true,
                beatFile: true,
            },
        });

        if ( !data ) throw new ResultNotFound(rm.INVALID_FILE_ID);
        return data;
    } catch (error) {
        throw error;
    }
};

const getAllBeat = async(page: number, limit: number) => {
    try {

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
                        id: true,
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
                producerId: item.Producer.id,
                producerName: item.Producer.name,
                keyword: item.keyword,
                category: item.category[0],
                wavFileLength: item.BeatFileDuration?.duration as number
            };
            
            return beatReturn;
        }));

        if ( !allBeats ) throw new ResultNotFound(rm.INVALID_BEAT_ID);
        return allBeats;
    } catch (error) {
        throw error;
    }
}

const getAllComment = async(beatId: number, userId: number, tableName: string, page: number, limit: number) => {
    try {
        //beatid에 해당하는 코멘트들 싹 가져오기
        //(코멘트고유id/보컬id/코멘트id/댓글wav파일/내용/재생길이
        const beatData = await prisma.beat.findUnique({
            where: {
                id: beatId
            },
        });

        if ( !beatData ) throw new InvalidBeatIdError(rm.INVALID_BEAT_ID);
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

        if ( !allComments ) throw new ResultNotFound(rm.INVALID_BEAT_ID);
        return allComments;
    } catch (error) {
        throw error;
    }
}

const updateBeatClosed = async(beatId: number) => {
    try {
        const isClosedBeat = await prisma.beat.findUnique({
            where: {
                id: beatId,
            },
            select: {
                isClosed: true,
            }
        });

        const changeIsClosed = (isClosedBeat?.isClosed) ? false: true;
        const data = await prisma.beat.update({
            where: {
                id: beatId,
            },
            data: {
                isClosed: changeIsClosed,
            },
        });
        
        if ( !data ) throw new ResultNotFound(rm.BEAT_CLOSED_FAIL);
        return data;
    } catch (error) {
        throw error;
    }
};
    
const getClickedBeat = async(beatId: number, userId: number, tableName: string) => {
    try {
        const beatData = await prisma.beat.findUnique({
            where: { id: beatId }
        });

        if (!beatData) throw new InvalidBeatIdError(rm.INVALID_BEAT_ID);

        const producerData = await prisma.producer.findUnique({
            where: { id: beatData.producerId },
            select: {
                name: true,
                producerImage: true,
                producerID: true,
                id: true,
            }
        });
        
        if (!producerData) throw new InvalidBeatIdError(rm.INVALID_BEAT_ID);

        const isMe = (userId === producerData?.id) ? true: false;
        const wavefileLength = await getAudioDurationInSeconds(beatData.beatFile);
        
        const getClickBeatReturn: BeatClickedDTO = {

            beatId: beatData.id,
            jacketImage: beatData.beatImage,
            beatWavFile: beatData.beatFile,
            title: beatData.title,
            producerId: producerData.id,
            producerName: producerData.name,
            producerProfileImage: producerData.producerImage,
            introduce: beatData.introduce || '',
            keyword: beatData.keyword,
            category: beatData.category[0],
            isMe: isMe as boolean,
            wavFileLength: wavefileLength,
            isClosed: beatData.isClosed,
        };

        if ( !getClickBeatReturn ) throw new ResultNotFound(rm.GET_CLICKED_BEAT_FAIL);
        return getClickBeatReturn;
    } catch (error) {
        throw error;
    }
}

const postBeatComment = async(beatId: number, commentDTO: CommentCreateDTO, wavLocation: string)=> {
    try {
        const data = await prisma.comment.create({
            data: {
                beatId: beatId,
                vocalId: commentDTO.userId,
                commentFile: wavLocation,
                content:commentDTO.content,
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

        if ( !data ) throw new ResultNotFound(rm.COMMENT_UPLOAD_FAIL);
        return data;
    } catch (error) {
        throw error;
    }
};   

const getFilteredTracks = async(categList: string[], page: number, limit: number) => {
    try {
        //! 작업물 최신순 정렬
        const trackList = await prisma.beat.findMany({
            select:{
                id: true,
                beatImage: true,
                beatFile: true,
                title: true,
                Producer: {
                    select: {
                        id: true,
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
                AND: 
                    [
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
                producerId: track.Producer.id,
                producerName: track.Producer.name,
                keyword: track.keyword,
                category: track.category[0],
                wavFileLength: track.BeatFileDuration?.duration as number,
            }
            return returnDTO;
        }));

        if ( !result ) throw new ResultNotFound(rm.GET_FILTERING_FAIL);
        return result;
    } catch (error) {
        throw error;
    }
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