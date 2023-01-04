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

const getAllBeat = async() => {

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
<<<<<<< HEAD

            },
        },
        orderBy: {
            createdAt: 'desc',
        }
    });
=======
            },
        },
    });
    
>>>>>>> 817b42e8016b95f90f0ee0a4b75b41a908f43da7
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
    
    const allBeats = await Promise.all(allBeatData.map(async (item, i) => {
        const prd = producerNameData[i] as any;
        console.log(item)
        const beatReturn: AllBeatDTO = {
            beatId: item.id,
            jacketImage: item.beatImage,
            wavFile: item.beatFile,
            title: item.title,
            producerName: prd['name'],
            keyword: item.keyword,
            category: item.category,
            wavFileLength: item.BeatFileDuration?.duration as number
        };
        
        return beatReturn;
    }));
    return allBeats;
}

const getAllComment = async(beatId: number, userId: number, tableName: string) => {

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
            }
        }
    });

    if(!allCommentData) return null;

    let commentVocalData: object[] = [];

    for(const data of allCommentData){ // 코멘트 하나당 돌면서
        // name/profileImage
        const temp = await prisma.vocal.findUnique({
            where:{
                id: data.vocalId
            },
            select:{
                name: true,
                vocalImage: true // 보컬 프로필 이미지
            }
        });

        commentVocalData.push(temp as object);
        //console.log(commentVocalData);

    }
    
    const allComments = await Promise.all(allCommentData.map(async (item, i) => {
        const crd = commentVocalData[i] as any;
        const isMe = (userId == item.vocalId) ? true: false;
        console.log(item)
        const commentReturn: AllCommentDTO = {
            commentId : item.id,
	        vocalWavFile : item.commentFile,
	        vocalName : crd['name'],
            vocalProfileImage : crd['vocalImage'],
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

const tracksService = {
    createBeat,
    getBeatLocation,
    getAllBeat,
    updateBeatClosed,
    getClickedBeat,
    postBeatComment,
    getAllComment,
};

export default tracksService;