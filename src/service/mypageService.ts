import { PrismaClient } from "@prisma/client";
import { ProducerPortfolioDTO } from '../interfaces/mypage';

const prisma = new PrismaClient();

const postProducerPortfolio  = async(portfolioDTO: ProducerPortfolioDTO, jacketLocation: string, wavLocation: string) => {
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

const mypageService = {
    postProducerPortfolio,
};

export default mypageService;