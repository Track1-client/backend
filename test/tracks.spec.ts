import request from 'supertest'; 
import { expect } from 'chai';
import config from "../src/config";
import app from '../src/index';
import convertURLtoFile from '../src/modules/makeFile';
import { allFilteredTracks, allTrackExample, beatNum10Info, getFileLink, trackCommentExample } from './constant';
import path from 'path';

let audioTest: Blob;
let imageTest: Blob;

convertURLtoFile('../../test/file/audioFile.mp3').then((data) => {
    audioTest = data;
});

convertURLtoFile('../../test/file/jacketImage.jpeg').then((data) => {
    imageTest = data;
});


const audio = path.resolve(__dirname, `./file/audioFile.mp3`);
const image = path.resolve(__dirname, `./file/jacketImage.jpeg`);
console.log(audio);

//! [GET] TEST
describe('GET /tracks?page=limit=', () => {
    it('전체 게시글 조회 성공', done => {
        request(app)
            .get('/tracks')
            .set('Content-Type', 'application/json')
            .set('Authorization', config.producerToken)
            .query({
                page: 1,
                limit: 2,
            })
            .then((res) => {
                expect(res.status).to.eql(200);
                expect(res.body.message).to.eql("전체 트랙 조회 성공");

                const { trackList } = res.body.data;
                expect(trackList).to.eql(allTrackExample);
                done();
            })
            .catch(err => {
                console.error('[ERROR] : ', err);
                done(err);
            })
    });

});

describe('GET /tracks/filter?page=limit=categ=', () => {
    it('필터링 게시글 조회 성공', done => {
        request(app)
            .get('/tracks/filter')
            .set('Content-Type', 'application/json')
            .set('Authorization', config.producerToken)
            .query({
                page: 1,
                limit: 2,
                categ: [0, 3],
            })
            .then((res) => {
                expect(res.status).to.eql(200);
                expect(res.body.message).to.eql("필터링 조회 성공");

                const { trackList } = res.body.data;
                expect(trackList).to.eql(allFilteredTracks);
                done();
            })
            .catch(err => {
                console.error('[ERROR] : ', err);
                done(err);
            })
    });

});

describe('GET /tracks/:beatId', () => {
    it('특정 게시글 조회', done => {
        request(app)
            .get('/tracks/10')
            .set('Content-Type', 'application/json')
            .set('Authorization', config.producerToken)
            .then((res) => {
                expect(res.status).to.eql(200);
                expect(res.body.message).to.eql("게시글 조회 성공");
                expect(res.body.data).to.eql(beatNum10Info);
                done();
            })
            .catch(err => {
                console.error('[ERROR] : ', err);
                done(err);
            })
    });
});

describe('GET /tracks/comments/:beatId?page=limit=', () => {
    it('게시글 댓글 조회', done => {
        request(app)
            .get('/tracks/comments/1')
            .set('Content-Type', 'application/json')
            .set('Authorization', config.producerToken)
            .query({
                page: 1,
                limit: 2,
            })
            .then((res) => {
                expect(res.status).to.eql(200);
                expect(res.body.message).to.eql("게시글 댓글 조회 성공");
                expect(res.body.data.commentList).to.eql(trackCommentExample);
                done();
            })
            .catch(err => {
                console.error('[ERROR] : ', err);
                done(err);
            })
    });
});

describe('GET /tracks/:beatId/download', () => {
    it('게시글 파일 다운로드', done => {
        request(app)
            .get('/tracks/10/download')
            .set('Content-Type', 'application/json')
            .set('Authorization', config.producerToken)
            .then((res) => {
                expect(res.status).to.eql(200);
                expect(res.body.message).to.eql("게시글 다운로드 성공");
                expect(res.body.data).to.eql(getFileLink);
                done();
            })
            .catch(err => {
                console.error('[ERROR] : ', err);
                done(err);
            })
    });
});


//! [POST] TEST
describe('POST /tracks', () => {

    it('게시글 생성 성공', done => {
        request(app)
            .post('/tracks')
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', config.producerToken)
            .attach("wavFile", audio)
            .attach("jacketImage", image)
            .field('title', "게시글 생성 테스트")
            .field('category', 1)
            .field('introduce', '게시글 생성 테스트임~')
            .field('keyword', ['잔잔한', '감성적인'])
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

describe('POST /tracks/:beatId', () => {
    it('댓글 생성 성공', done => {
        request(app)
            .post('/tracks/1')
            .field('Content-Type', 'multipart/form-data')
            .set('Authorization', config.vocalToken)
            .send({ 
                "title": "콘텐츠 생성 테스트",
                "description": "클라이언트 분들 화이팅팅",
                "image": "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F9994494C5C807AE00F",
                "url": "https://coding-factory.tistory.com/329",
                "isNotified": true,
                "notificationTime": "2022-01-23 03:12",
                "categoryIds": [6, 9]
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(res => {
                done();
            })
            .catch(err => {
                console.error("######Error >>", err);
                done(err);
            });
    });
});



//! [PATCH] TEST
describe('PATCH /tracks/:beatId/closed', () => {




});