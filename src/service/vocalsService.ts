import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from '../constants';
import _, { forEach } from 'lodash';
import { AllVocalReturnDTO } from '../interfaces/vocals';
const prisma = new PrismaClient();

const getVocals = async(page: number, limit: number) => {

    //! 작업물 최신순 정렬
    const vocalList = await prisma.vocalOrder.findMany({
        select: {
            Vocal: {
                select: {
                    id: true,
                    vocalPortfolio: {
                        select: {
                            vpfFile: true,
                            id: true,
                            VocalPortfolioDuration: {
                                select: {
                                    duration: true,
                                },
                            },
                        },
                        where: {
                            VocalTitle: {
                                isNot: null  //~ 타이틀 테이블 가지고 있는 포트폴리오 (즉, 타이틀인 포트폴리오 가져오기)
                            },
                        },
                    },
                    vocalImage: true,
                    name: true,
                    category: true,
                    keyword: true,
                    isSelected: true,
                    
                },
            },
        },
        orderBy: {
            createdAt: "desc"  //~ 최신순 정렬
        },
        distinct: ['vocalId'],  //~ 인덱스 0의(최신의) vocalId를 기준으로 부터 중복된 vocalId는 가져오지 않음. 
        skip: (page-1)*limit,
        take: limit,
    });

    const result = await Promise.all(vocalList.map((vocal) => {

        const getVocal = vocal.Vocal;
        const categNum = (getVocal.category.length - 1 < 0) ? 0 : getVocal.category.length - 1;

        const returnDTO:AllVocalReturnDTO = {
            vocalId: getVocal.id,
            vocalProfileImage: getVocal.vocalImage,
            vocalTitleFile: getVocal.vocalPortfolio[0]?.vpfFile,
            vocalName: getVocal.name,
            category: getVocal.category,
            keyword: getVocal.keyword,
            totalCategNum: categNum,
            wavFileLength: getVocal.vocalPortfolio[0]?.VocalPortfolioDuration?.duration as number,
            isSelected: getVocal.isSelected
        }
        return returnDTO;
    }));

    return result;
};

const getFilteredVocals = async(categList: string[], isSelected: string, page: number, limit: number) => {

    var isTrueSet = (isSelected === 'true');  //~ true이면 활동중인 사람 isselected = true , false이면 전부 다 
    
    //! 작업물 최신순 정렬
    if (!isTrueSet) return await getVocals(page, limit);   //! false이면 전부 다 리턴 

    const vocalList = await prisma.vocalOrder.findMany({
        select: {
            Vocal: {
                select: {
                    id: true,
                    vocalPortfolio: {
                        select: {
                            vpfFile: true,
                            id: true,
                            VocalPortfolioDuration: {
                                select: {
                                    duration: true,
                                },
                            },
                        },
                        where: {
                            VocalTitle: {
                                isNot: null  //~ 타이틀 테이블 가지고 있는 포트폴리오 (즉, 타이틀인 포트폴리오 가져오기)
                            }
                        }
                    },
                    vocalImage: true,
                    name: true,
                    category: true,
                    keyword: true,
                    isSelected: true,
                },
            },
        },
        where: {
            AND: [
                { Vocal: { category: { hasSome: categList } } },
                { Vocal: { isSelected: isTrueSet } },
            ],
        },
        orderBy: {
            createdAt: "desc"  //~ 최신순 정렬
        },
        distinct: ['vocalId'],  //~ 인덱스 0의(최신의) vocalId를 기준으로 부터 중복된 vocalId는 가져오지 않음. 
        skip: (page-1)*limit,
        take: limit,
    });
    
    const result = await Promise.all(vocalList.map((vocal) => {

        const getVocal = vocal.Vocal;
        const categNum = (getVocal.category.length - 1 < 0) ? 0 : getVocal.category.length - 1;

        const returnDTO:AllVocalReturnDTO = {
            vocalId: getVocal.id,
            vocalProfileImage: getVocal.vocalImage,
            vocalTitleFile: getVocal.vocalPortfolio[0]?.vpfFile,
            vocalName: getVocal.name,
            category: getVocal.category,
            keyword: getVocal.keyword,
            totalCategNum: categNum,
            wavFileLength: getVocal.vocalPortfolio[0]?.VocalPortfolioDuration?.duration as number,
            isSelected: getVocal.isSelected
        }
        return returnDTO;
    }));
    console.log(result);
    return result;

};

const vocalsService = {
    getVocals,
    getFilteredVocals,
};

export default vocalsService;