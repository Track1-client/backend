export default interface GetSortedBeats {
    beatId: number;
    jacketImage: string;
    beatWavFile: string;
    title: string;
    introduce: string;
    keyword: string[];
    category: string;
    wavFileLength: number;
    isSelected: boolean;
};