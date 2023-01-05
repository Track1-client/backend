import ProducerPortfolio from "./ProducerPortfolioDTO";

export default interface ProducerProfileReturnDTO {

    isMe: boolean;
    producerProfile: {
        profileImge: string;
        name: string;
        contact: string;
        keyword: string[];
        category: string[];
        introduce: string;
    };
    producerPortfolio: ProducerPortfolio[];
} 