import VocalPortfolio from "./VocalPortfolioDTO";

export default interface VocalProfileReturnDTO {
    whoamI: string;
    isMe: boolean;
    vocalProfile: {
        id: number;
        profileImge: string;
        name: string;
        contact: string;
        category: string[];
        keyword: string[];
        introduce: string;
        isSelected: boolean;
    };
    vocalPortfolio: VocalPortfolio[];
}