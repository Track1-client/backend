import { PrismaClient } from "@prisma/client";
import { ProducerProfileReturnDTO, ProducerPortfolioReturnDTO, GetSortedBeatsDTO } from "../interfaces/profile";

const prisma = new PrismaClient();

//* 포트폴리오 get (타이틀을 0번 인덱스로 반환하기)
const getProducerProfileData = async(producerId: number, userId: number, tableName: string) => {
    //! 타이틀인 포트폴리오 + 프로듀서 정보 
    const producerProfileData = await prisma.producerPortfolio.findFirst({

        where:{
            producerId: producerId
        },
        select:{
            ppfImage: true,
            Producer:{
                select:{
                    name: true,
                    contact: true,
                    category: true,
                    keyword: true,
                    introduce: true,
                    ProducerPortfolio: {  //! 타이틀 포트폴리오 받아오기 
                        select: {
                            id: true,
                            ppfImage: true,
                            ppfFile: true,
                            title: true,
                            content: true,
                            keyword: true,
                            category: true,
                            ProducerPortfolioDuration:{
                                select: {
                                    duration: true,
                                }
                            },
                        },
                        where: {
                            ProducerTitle: {
                                isNot: null,
                            }
                        }
                    },
                },
            }
        }

    });

    if (!producerProfileData) return null;

    //! 타이틀 아닌 포트폴리오들 리스트
    const producerPortfolioData = await prisma.producerPortfolio.findMany({
        select:{
            id: true,
            ppfImage: true,
            ppfFile: true,
            title: true,
            content: true,
            keyword: true,
            category: true,
            ProducerPortfolioDuration:{
                select: {
                    duration: true,
                }
            },
        },
        where: {
            ProducerTitle: {
                is: null,
            },
        },
    });

    const title = producerProfileData.Producer.ProducerPortfolio[0];  //! 타이틀 포트폴리오

    const producerPortfolioTitle: ProducerPortfolioReturnDTO = { //! 타이틀 포트폴리오 DTO
        id: title.id,
        jacketImage: title.ppfImage,
        beatWavFile: title.ppfFile,
        title: title.title,
        content: title.content as string,
        keyword: title.keyword,
        category: title.category[0] as string,
        wavFileLength: title.ProducerPortfolioDuration?.duration as number,
    };
    
    //! 타이틀 아닌 포트폴리오들 DTO
    const notTitleList = await Promise.all(producerPortfolioData.map((portfolio) => {
        const returnDTO: ProducerPortfolioReturnDTO = {
            id: portfolio.id,
            jacketImage: portfolio.ppfImage,
            beatWavFile: portfolio.ppfFile,
            title: portfolio.title,
            content: portfolio.content as string,
            keyword: portfolio.keyword,
            category: portfolio.category[0] as string,
            wavFileLength: portfolio.ProducerPortfolioDuration?.duration as number,
        }

        return returnDTO;
    }));

    notTitleList.unshift(producerPortfolioTitle);  //! 타이틀 포트폴리오를 리스트 0번으로 넣기 (전체포트폴리오 리스트)

    const returnDTO: ProducerProfileReturnDTO = {  
        isMe : (producerId == userId)? true: false,
        producerProfile: {
            profileImge: producerProfileData.ppfImage,
            name: producerProfileData.Producer.name,
            contact: producerProfileData.Producer.contact,
            keyword: producerProfileData.Producer.keyword,
            category: producerProfileData.Producer.category,
            introduce: producerProfileData.Producer.introduce as string,
        },
        producerPortfolio: notTitleList,
    };

    return returnDTO;
};

//* 리스트 : 보컬 구하는 중인 게시글 (0) ~ 마감한 게시글(n) 순서로 반환 
//* 보컬 구하는 중/마감한 글 내부에서는 최신순 정렬  
const getOpenedBeatsList = async(producerId: number) => {

    const sortedBeats = await prisma.beat.findMany({
        where: {
            producerId
        },
        orderBy: [
            { isClosed: 'asc' },   //!  false -> true 순서 정렬 (우선순위 1)
            { createdAt: 'desc'},   //!  만들어진 시간 순서 정렬 (우선순위 2)
        ],
        select: {
            id: true,
            beatImage: true,
            beatFile: true,
            title: true,
            introduce: true,
            keyword: true,
            category: true,
            isClosed: true,
            BeatFileDuration: {
                select: {
                    duration: true
                },
            },
        }
    });
    
    const resultList = await Promise.all(sortedBeats.map((beat) => {
        const result: GetSortedBeatsDTO = {
            beatId: beat.id,
            jacketImage: beat.beatImage,
            beatWavFile: beat.beatFile,
            title: beat.title,
            introduce: beat.introduce as string,
            keyword: beat.keyword,
            category: beat.category[0] as string,
            wavFileLength: beat.BeatFileDuration?.duration as number,
            isSelected: beat.isClosed
        };

        return result;
    }));

    return resultList;
};

const profileService = {
    getProducerProfileData,
    getOpenedBeatsList,
}

export default profileService;
