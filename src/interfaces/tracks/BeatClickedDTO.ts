export default interface BeatClickedDTO {
    beatId: number;
    jacketImage: string;
    beatWavFile: string;
    title: string;
    producerId: number;
    producerName: string;
    producerProfileImage: string;
    introduce: string;
    keyword: string[];
    category: string;
    isMe: boolean;
    wavFileLength: number;
    isClosed: boolean;
};