import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from '../constants';
import { ProducerPortfolioDTO } from "../interfaces/mypage";
import { ProducerProfileReturnDTO, ProducerPortfolioReturnDTO } from "../interfaces/profile";

const prisma = new PrismaClient();

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
                    ProducerPortfolio: {
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

    //! 타이틀 아닌 포트폴리오
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

    const title = producerProfileData.Producer.ProducerPortfolio[0];

    const producerPortfolioTitle: ProducerPortfolioReturnDTO = {
        producerPortfolioId: title.id,
        jacketImage: title.ppfImage,
        beatWavFile: title.ppfFile,
        title: title.title,
        content: title.content as string,
        keyword: title.keyword,
        category: title.category[0] as string,
        wavFileLength: title.ProducerPortfolioDuration?.duration as number,
    };
    
    const notTitleList = await Promise.all(producerPortfolioData.map((portfolio) => {

        const returnDTO: ProducerPortfolioReturnDTO = {
            producerPortfolioId: portfolio.id,
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

    notTitleList.unshift(producerPortfolioTitle);
   
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

const profileService = {
    getProducerProfileData,
}

export default profileService;

function portfolio(portfolio: any): unknown[] {
    throw new Error("Function not implemented.");
}
