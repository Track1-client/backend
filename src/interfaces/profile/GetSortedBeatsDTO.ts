export default interface GetSortedBeats {
    id: number;
    jacketImage: string;
    beatWavFile: string;
    title: string;
    content: string;
    keyword: string[];
    category: string;
    wavFileLength: number;
    isSelected: boolean;
};