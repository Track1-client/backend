import VocalPortfolio from "./VocalPortfolioDTO";

export default interface VocalProfileReturnDTO {
    isMe: boolean;
    vocalProfile: {
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