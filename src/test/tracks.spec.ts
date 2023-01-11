import request from 'supertest'; 
import { expect } from 'chai';
import app from '../index';
import { allFilteredTracks, allTrackExample, beatNum10Info, getFileLink, trackCommentExample } from './constant';
import path from 'path';

const producerToken = process.env.PRODUCER_TOKEN as string;
const vocalToken = process.env.VOCAL_TOKEN as string;

//! [GET] TEST
describe('GET /tracks?page=limit=', () => {
    it('전체 게시글 조회 성공', done => {
        request(app)
            .get('/tracks')
            .set('Content-Type', 'application/json')
            .set('Authorization', producerToken)
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
            .set('Authorization', producerToken)
            .query({
                page: 1,
                limit: 2,
                categ: [0,3]
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
            .set('Authorization', producerToken)
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
            .set('Authorization', producerToken)
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
            .set('Authorization', producerToken)
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
describe('POST /tracks/:beatId', () => {
    const audiofile = path.resolve(__dirname, 'src/file/audioFile.wav');

    it('게시글 생성 성공', done => {
        request(app)
            .post('/tracks/1')
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', vocalToken)
            .field('content', "댓글 생성 테스트")
            .attach('wavFile', 'src/test/file/audioFile.wav')
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

//! TO_DO 사진 이미지 같이 하는거 왜 안돼 왜 왜 왜대체 왜 와이 

describe('POST /tracks', () => {
    it('게시글 생성 성공', done => {
        request(app)
            .post('/tracks')
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', producerToken)
            .field('title', "게시글 생성 테스트")
            .field('category', 'Ballad')
            .field('introduce', '게시글 생성 테스트임~')
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
describe('PATCH /tracks/:beatId/closed', () => {
    it('게시글 마감 성공', done => {
        request(app)
            .patch('/tracks/3/closed')
            .set('Content-Type', 'application/json')
            .set('Authorization', producerToken)
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