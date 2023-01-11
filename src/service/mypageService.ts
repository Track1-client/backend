import { PrismaClient } from "@prisma/client";
import getAudioDurationInSeconds from 'get-audio-duration';
import { title } from 'process';
import { ProducerPortfolioDTO, VocalPortfolioDTO, ProducerPortfolioReturnDTO, VocalPortfolioReturnDTO, TitleUpdateReturnDTO } from '../interfaces/mypage';

const prisma = new PrismaClient();


//* 프로듀서 포트폴리오 관련 
const postProducerPortfolio = async(portfolioDTO: ProducerPortfolioDTO, jacketLocation: string, wavLocation: string) => {
    const data = await prisma.producerPortfolio.create({
        data: {
            title: portfolioDTO.title,
            category: portfolioDTO.category,
            ppfFile: wavLocation,
            ppfImage: jacketLocation,
            content: portfolioDTO.introduce,
            keyword: portfolioDTO.keyword,
            producerId: portfolioDTO.userId,
            ProducerPortfolioDuration: {
                create: {
                    duration: await getAudioDurationInSeconds(wavLocation)
                }
            }
        },
    });

    const producerPortfolioId = data.id;
    const producerId = portfolioDTO.userId;

    const titleId = await createProducerTitle(producerPortfolioId, producerId);

    const result: ProducerPortfolioReturnDTO = {
        producerPortfolioId: data.id,
        producerTitleId: titleId as number
    }

    return result;
};

//! 게시글 1개일 경우 타이틀 생성 or 타이틀 아이디 가져오기 
const createProducerTitle = async(producerPortfolioId: number, producerId: number) => {
    const isTitleExists = await prisma.producerTitle.findFirst({
        where: {
            producerId
        },
        select: {
            id: true
        }
    });

    //! 타이틀 없을 경우 생성 
    if(!isTitleExists) {
        const titleId = await prisma.producerTitle.create({
            data:{
                producerId,
                producerPortfolioId
            }
        }); 
        return titleId;
    }
    else return isTitleExists.id;   //! 타이틀 존재하는 경우 타이틀 아이디 반환 
};


//* 보컬 포트폴리오 관련 
const postVocalPortfolio = async(portfolioDTO: VocalPortfolioDTO, jacketLocation: string, wavLocation: string) => {
    const data = await prisma.vocalPortfolio.create({
        data: {
            title: portfolioDTO.title,
            category: portfolioDTO.category,
            vpfFile: wavLocation,
            vpfImage: jacketLocation,
            content: portfolioDTO.introduce,
            keyword: portfolioDTO.keyword,
            vocalId: portfolioDTO.userId,
            VocalPortfolioDuration: {
                create: {
                    duration: await getAudioDurationInSeconds(wavLocation)
                }
            }
        },
    });

    const vocalPortfolioId = data.id;
    const vocalId = portfolioDTO.userId;

    const titleId = await createVocalTitle(vocalPortfolioId, vocalId);

    //! vocalOrder 생성
    const createVocalOrder = await prisma.vocalOrder.create({
        data: {
            vocalId: vocalId,
            orderStandardTableName: 'portfolio',
            orderStandardTableId: data.id,
        }
    });

    const result: VocalPortfolioReturnDTO = {
        vocalPortfolioId: data.id,
        vocalTitleId: titleId as number
    };

    return result;
};

//! 게시글 1개일 경우 타이틀 생성 or 타이틀 아이디 가져오기 
const createVocalTitle = async(vocalPortfolioId: number, vocalId: number) => {
    const isTitleExists = await prisma.vocalTitle.findFirst({
        where: {
            vocalId
        },
        select: {
            id: true
        }
    });

    //! 타이틀 없을 경우 생성 
    if(!isTitleExists) {
        const titleId = await prisma.vocalTitle.create({
            data:{
                vocalId,
                vocalPortfolioId
            }
        }); 
        return titleId;
    }
    else return isTitleExists.id;   //! 타이틀 존재하는 경우 타이틀 아이디 반환 
};


//* 프로듀서 포트폴리오 타이틀 변경 
const updateProducerTitle = async(oldTitlePortfolioId: number, newTitlePortfolioId: number, userId: number) => {
    //! 프로듀서의 포트폴리오가 맞는지 확인
    const isValidProducerPortfolioId = await prisma.producerPortfolio.findMany({
        where: {
            AND: [
                { Producer: { id: userId } },
                { id: { in: [oldTitlePortfolioId, newTitlePortfolioId] } },
            ]
        },
    });
    
    if ( Object.keys(isValidProducerPortfolioId).length !== 2) return null;  //! oldId, newId가 프로듀서 포폴 아니면 예외처리 

    await prisma.producerTitle.delete({  
        where: {
            producerId: userId
        }
    });

    const data = await prisma.producerTitle.create({
        data: {
            producerId: userId,
            producerPortfolioId: newTitlePortfolioId
        }
    });

    const returnResult:TitleUpdateReturnDTO = {
        oldTitleId: oldTitlePortfolioId,
        newTitleId: data.producerPortfolioId,  
    };

    return returnResult;
};

//* 보컬 포트폴리오 타이틀 변경
const updateVocalTitle = async(oldTitlePortfolioId: number, newTitlePortfolioId: number, userId: number) => {
    //! 프로듀서의 포트폴리오가 맞는지 확인
    const isValidVocalPortfolioId = await prisma.vocalPortfolio.findMany({
        where: {
            AND: [
                { Vocal: { id: userId } },
                { id: { in: [oldTitlePortfolioId, newTitlePortfolioId] } },
            ]
        },
    });

    if ( Object.keys(isValidVocalPortfolioId).length != 2) return null;

    await prisma.vocalTitle.delete({  
        where: {
            vocalId: userId
        }
    });

    const data = await prisma.vocalTitle.create({
        data: {
            vocalId: userId,
            vocalPortfolioId: newTitlePortfolioId
        }
    });
    
    const returnResult:TitleUpdateReturnDTO = {
        oldTitleId: oldTitlePortfolioId,
        newTitleId: data.vocalPortfolioId,  
    };

    return returnResult;
};

const mypageService = {
    postProducerPortfolio,
    postVocalPortfolio,
    updateProducerTitle,
    updateVocalTitle,
};

export default mypageService;