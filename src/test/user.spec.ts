import request from 'supertest'; 
import expect from 'chai';
import app from '../index';


//! [POST] TEST
describe('POST /user/join/producer', () => {
    it('프로듀서 회원가입', done => {
        request(app)
            .post('/user/join/producer')
            .set('Content-Type', 'multipart/form-data')
            .field('title', "프로듀서 회원가입 테스트")
            .attach('imageFile', 'src/test/file/profileImage.png')
            .field('ID', process.env.PRODUCER_ID as string)
            .field('PW', process.env.PRODUCER_PW as string)
            .field('name', 'joinExamplePRODUCER')
            .field('contact', '@track1_official_example')
            .field('category[0]', 'Ballad')
            .field('category[1]', 'R&B')
            .field('introduce', '프로듀서 포트폴리오 생성 테스트임~')
            .field('keyword[0]', '잔잔한')
            .field('keyword[1]', '감성적인')
            .expect(201)
            .then(res => {
                done();
            })
            .catch(err => {
                console.error('[ERROR] : ', err);
                done(err);
            });
        });
});

describe('POST /user/join/vocal', () => {
    it('보컬 회원가입', done => {
        request(app)
            .post('/user/join/vocal')
            .set('Content-Type', 'multipart/form-data')
            .field('title', "보컬 회원가입 테스트")
            .attach('imageFile', 'src/test/file/profileImage.png')
            .field('ID', process.env.VOCAL_ID as string)
            .field('PW', process.env.VOCAL_PW as string)
            .field('name', 'joinExampleVOCAL')
            .field('contact', '@track1_official_example')
            .field('category[0]', 'EDM')
            .field('category[1]', 'R&B')
            .field('category[2]', 'Pop')
            .field('introduce', '보컬 포트폴리오 생성 테스트임~')
            .field('keyword[0]', '신나는')
            .field('keyword[1]', '케이팝')
            .field('isSelected', 'true')
            .expect(201)
            .then(res => {
                done();
            })
            .catch(err => {
                console.error('[ERROR] : ', err);
                done(err);
            });
        });
});

describe('POST /user/login', () => {
    it('유저 로그인', done => {
        request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({ 
                'ID': process.env.VOCAL_ID as string,
                'PW': process.env.VOCAL_PW as string
            })
            .expect(200)
            .then(res => {
                done();
            })
            .catch(err => {
                console.error('[ERROR] : ', err);
                done(err);
            });
        });
});