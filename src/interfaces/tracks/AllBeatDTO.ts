export default interface AllBeatDTO {
    beatId: number;
    jacketImage: string;
    wavFile: string;
    title: string;
    producerName: string;
    keyword: string[];
    category: string[];
    wavFileLength: Promise<number>;
};