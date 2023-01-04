export default interface AllVocalReturnDTO {
    vocalId: number;
    vocalProfileImage: string;
    vocalTitleFile: string;
    vocalName: string;
    category: string[];
    keyword: string[];
    totalCategNum: number;
    wavFileLength: number;
    isSelected: boolean;
};