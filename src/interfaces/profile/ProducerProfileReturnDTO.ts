import ProducerPortfolio from "./ProducerPortfolioDTO";

export default interface ProducerProfileReturnDTO {
    whoamI: string;
    isMe: boolean;
    producerProfile: {
        id: number;
        profileImge: string;
        name: string;
        contact: string;
        keyword: string[];
        category: string[];
        introduce: string;
    };
    producerPortfolio: ProducerPortfolio[];
} 