import { PrismaClient } from "@prisma/client";
import { producerJoinDTO, userLogInDTO, vocalJoinDTO } from '../interfaces';
import bcrypt from "bcryptjs";
import { sc } from '../constants';

const prisma = new PrismaClient();

const createProducer = async(producerCreateDto: producerJoinDTO, location: string) => {

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(producerCreateDto.PW, salt); 

    const existsUser = await prisma.producer
        .findFirst({
            where: {
                OR: [
                    {producerID: producerCreateDto.ID},
                    {name: producerCreateDto.name},
                ]
            }
        })
    
    if (existsUser) return null;  //! 중복 아이디 또는 닉네임 존재 
    
    const data = await prisma.producer
        .create({
            data: {
                producerID: producerCreateDto.ID,
                producerPW: password,
                name: producerCreateDto.name,
                contact: producerCreateDto.contact,
                category: producerCreateDto.category,
                keyword: producerCreateDto.keyword,
                introduce: producerCreateDto.introduce,
                producerImage: location,
            }
        });

    return data;
};


const createVocal = async(vocalCreateDto: vocalJoinDTO, location: string) => {

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(vocalCreateDto.PW, salt); 

    const existsUser = await prisma.vocal
        .findFirst({
            where: {
                OR: [
                    {vocalID: vocalCreateDto.ID},
                    {name: vocalCreateDto.name}
                ]
            }
        })
    
    if (existsUser) return null;  //! 중복 아이디 또는 닉네임 존재 

    const data = await prisma.vocal
        .create({
            data: {
                vocalID: vocalCreateDto.ID,
                vocalPW: password,
                name: vocalCreateDto.name,
                contact: vocalCreateDto.contact,
                category: vocalCreateDto.category,
                keyword: vocalCreateDto.keyword,
                introduce: vocalCreateDto.introduce,
                isSelected: vocalCreateDto.isSelected,
                vocalImage: location,
            }
        });

    return data;
};

const logIn = async(userLogInDTO: userLogInDTO) => {
    try {
        const producer = await prisma.producer.findFirst({
            where: {
                producerID: userLogInDTO.ID,
            },
        });

        const vocal = await prisma.vocal.findFirst({
            where: {
                vocalID: userLogInDTO.ID,
            },
        });

        const user = producer || vocal
        console.log(user);
        if (!user) return null;  //! 존재하지 않는 ID

        const userPW = producer?.producerPW || vocal?.vocalPW; 
        console.log(userPW);
        console.log(userLogInDTO.PW);
        const isMatch = await bcrypt.compare(userLogInDTO.PW, userPW as string);
        if (!isMatch) return sc.UNAUTHORIZED;
    
        return user.id;
    } 
    catch (error) {
        console.log(error);
        throw error;
    }
};


const userService = {
    createProducer,
    createVocal,
    logIn,
};

export default userService;