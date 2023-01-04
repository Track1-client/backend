import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from '../constants';
import _, { forEach } from 'lodash';
import { AllVocalReturnDTO } from '../interfaces/vocals';
const prisma = new PrismaClient();

const getVocals = async() => {

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
                            }
                        }
                    },
                    vocalImage: true,
                    name: true,
                    category: true,
                    keyword: true,
                    isSelected: true,
                    _count: {
                        select: {
                            vocalPortfolio: true,  //! 나중에 -1해서 넘겨주기!!!!!
                        }
                    }
                },
            }
        },
        orderBy: {
            createdAt: "desc"  //~ 최신순 정렬
        },
        distinct: ['vocalId']  //~ 인덱스 0의(최신의) vocalId를 기준으로 부터 중복된 vocalId는 가져오지 않음. 
    });

    const result = await Promise.all(vocalList.map((vocal) => {
        const getVocal = vocal.Vocal;

        const returnDTO:AllVocalReturnDTO = {
            vocalId: getVocal.id,
            vocalProfileImage: getVocal.vocalImage,
            vocalTitleFile: getVocal.vocalPortfolio[0].vpfFile,
            vocalName: getVocal.name,
            category: getVocal.category,
            keyword: getVocal.keyword,
            totalCategNum: getVocal._count.vocalPortfolio - 1,
            wavFileLength: getVocal.vocalPortfolio[0].VocalPortfolioDuration?.duration as number,
            isSelected: getVocal.isSelected
        }
        return returnDTO;
    }));

    return result;
};

const getFilteredVocals = async(categList: string[]) => {

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
                            }
                        }
                    },
                    vocalImage: true,
                    name: true,
                    category: true,
                    keyword: true,
                    isSelected: true,
                    _count: {
                        select: {
                            vocalPortfolio: true,  
                        }
                    }
                },
            },
        },
        where: {
            Vocal: {
                category: {
                    hasSome: categList   //! 필터링
                }
            }
        },
        orderBy: {
            createdAt: "desc"  //~ 최신순 정렬
        },
        distinct: ['vocalId']  //~ 인덱스 0의(최신의) vocalId를 기준으로 부터 중복된 vocalId는 가져오지 않음. 
    });
    
    const result = await Promise.all(vocalList.map((vocal) => {
        const getVocal = vocal.Vocal;

        const returnDTO:AllVocalReturnDTO = {
            vocalId: getVocal.id,
            vocalProfileImage: getVocal.vocalImage,
            vocalTitleFile: getVocal.vocalPortfolio[0].vpfFile,
            vocalName: getVocal.name,
            category: getVocal.category,
            keyword: getVocal.keyword,
            totalCategNum: getVocal._count.vocalPortfolio - 1,
            wavFileLength: getVocal.vocalPortfolio[0].VocalPortfolioDuration?.duration as number,
            isSelected: getVocal.isSelected
        }
        return returnDTO;
    }));

    return result;

};

const vocalsService = {
    getVocals,
    getFilteredVocals,
};

export default vocalsService;