import { PrismaClient } from "@prisma/client";
import { ProducerPortfolioDTO, VocalPortfolioDTO } from '../interfaces/mypage';

const prisma = new PrismaClient();

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
        },
    });

    return data;
};

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
        },
    });

    return data;
};

const mypageService = {
    postProducerPortfolio,
    postVocalPortfolio,
};

export default mypageService;