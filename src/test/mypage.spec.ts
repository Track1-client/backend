import request from 'supertest'; 
import { expect } from 'chai';
import config from "../config";
import app from '../index';
import { getMypage } from './constant';

const producerToken = process.env.PRODUCER_TOKEN as string;
const vocalToken = process.env.VOCAL_TOKEN as string;

//! [GET] TEST
describe('GET /mypage?page=limit=', () => {
    it('마이페이지 조회 성공', done => {
        request(app)
            .get('/mypage')
            .set('Content-Type', 'application/json')
            .set('Authorization', vocalToken)
            .query({
                page: 1,
                limit: 2,
            })
            .then((res) => {
                expect(res.status).to.eql(200);
                expect(res.body.message).to.eql("보컬 프로필 조회 성공");
                expect(res.body.data).to.eql(getMypage);
                done();
            })
            .catch(err => {
                console.error('[ERROR] : ', err);
                done(err);
            })
    });

});


//! [POST] TEST
describe('POST /mypage/producer', () => {
    it('프로듀서 포트폴리오 작성 성공', done => {
        request(app)
            .post('/mypage/producer')
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', producerToken)
            .field('title', "프로듀서 포트폴리오 생성 테스트")
            .field('category', 'Ballad')
            .field('introduce', '프로듀서 포트폴리오 생성 테스트임~')
            .field('keyword[0]', '잔잔한')
            .field('keyword[1]', '감성적인')
            .attach('jacketImage', 'src/test/file/jacketImage2.png')
            .attach('wavFile', 'src/test/file/audioFile2.mp3')
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


//! [POST] TEST
describe('POST /mypage/vocal', () => {
    it('보컬 포트폴리오 작성 성공', done => {
        request(app)
            .post('/mypage/vocal')
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', vocalToken)
            .field('title', "보컬 포트폴리오 생성 테스트")
            .field('category', 'Ballad')
            .field('introduce', '보컬 포트폴리오 생성 테스트임~')
            .field('keyword[0]', '잔잔한')
            .field('keyword[1]', '감성적인')
            .attach('jacketImage', 'src/test/file/jacketImage2.png')
            .attach('wavFile', 'src/test/file/audioFile2.mp3')
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


//! [PATCH] TEST
describe('PATCH /mypage/producer?oldId=newId=', () => {
    it('프로듀서 타이틀 수정 성공', done => {
        request(app)
            .patch('/mypage/producer')
            .set('Content-Type', 'application/json')
            .set('Authorization', producerToken)
            .query({
                oldId: 2,
                newId: 1,
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

describe('PATCH /mypage/vocal?oldId=newId=', () => {
    it('보컬 타이틀 수정 성공', done => {
        request(app)
            .patch('/mypage/vocal')
            .set('Content-Type', 'application/json')
            .set('Authorization', vocalToken)
            .query({
                oldId: 2,
                newId: 3,
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