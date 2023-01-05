import { PrismaClient } from "@prisma/client";
import { producerJoinDTO, userLogInDTO, vocalJoinDTO } from '../interfaces';
import bcrypt from "bcryptjs";
import { sc } from '../constants';
import { UserLogInReturnDTO } from '../interfaces/user';
import convertCategory from '../modules/convertCategory';


const prisma = new PrismaClient();


//! 기존 프로듀서와 동일한 아이디나 이름 존재하는지 
function existsProducer(userID: string, userName: string): any {
    return prisma.producer
            .findFirst({
                where: {
                    OR: [
                        {producerID: 
                            {equals: userID}
                        },
                        {name: userName},
                    ]
                }
            });
};

//! 기존 보컬과 동일한 아이디나 이름 존재하는지 
function existsVocal(userID: string, userName: string): any {
    return prisma.vocal
            .findFirst({
                where: {
                    OR: [
                        {vocalID: 
                            {equals: userID}
                        },
                        {name: userName},
                    ]
                }
            });
};


const createProducer = async(producerCreateDto: producerJoinDTO, location: string) => {

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(producerCreateDto.PW, salt); 

    const userID = producerCreateDto.ID;
    const userName = producerCreateDto.name;

    const isProducerExists = await existsProducer(userID, userName);
    const isVocalExists = await existsVocal(userID, userName);
    
    if (isProducerExists || isVocalExists) return null;  //! 중복 아이디 또는 닉네임 존재 
    
    const data = await prisma.producer
        .create({
            data: {
                producerID: producerCreateDto.ID,
                producerPW: password,
                name: producerCreateDto.name,
                contact: producerCreateDto.contact,
                category: await convertCategory(producerCreateDto.category),
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

    const userID = vocalCreateDto.ID;
    const userName = vocalCreateDto.name;

    const isProducerExists = await existsProducer(userID, userName);
    const isVocalExists = await existsVocal(userID, userName);
    
    if (isProducerExists || isVocalExists) return null; //! 중복 아이디 또는 닉네임 존재 
    
    var isTrueSet = (vocalCreateDto.isSelected === 'true');
    const data = await prisma.vocal
        .create({
            data: {
                vocalID: vocalCreateDto.ID,
                vocalPW: password,
                name: vocalCreateDto.name,
                contact: vocalCreateDto.contact,
                category: await convertCategory(vocalCreateDto.category),
                keyword: vocalCreateDto.keyword,
                introduce: vocalCreateDto.introduce,
                isSelected: isTrueSet,
                vocalImage: location,
            }
        });

    return data;
};

const logIn = async(userLogInDTO: userLogInDTO) => {
    try {
        const producer = await prisma.producer.findFirst({
            where: {
                producerID: {
                    equals: userLogInDTO.ID
                },
            },
        });

        const vocal = await prisma.vocal.findFirst({
            where: {
                vocalID: {
                    equals: userLogInDTO.ID
                },
            },
        });

        const user = producer || vocal;
        if (!user) return null;  //! 존재하지 않는 ID
        const tableName = (producer) ? 'producer':'vocal';   //! 무조건 보컬이나 프로듀서에 존재 (위에서 존재하지 않는 ID 걸렀으므로)

        const userPW = producer?.producerPW || vocal?.vocalPW; 
        const isMatch = await bcrypt.compare(userLogInDTO.PW, userPW as string);
        if (!isMatch) return sc.UNAUTHORIZED;
        
        const result: UserLogInReturnDTO = { 
            tableName: tableName, 
            userId: user.id 
        };
        return result;
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