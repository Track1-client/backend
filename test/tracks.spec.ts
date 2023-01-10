import request from 'supertest'; 
import expect from 'chai';
import config from "../src/config";

const app = require('../src/index');

//! [GET] TEST
describe('GET /tracks?page=limit=', () => {
    it('전체 게시글 조회 성공', done => {
        request(app)
            .get('/content')
            .set('Content-Type', 'application/json')
            .set('Authorization', config.producerToken)
            
    });
    it('필요 값 없음', done => {

    });

});

describe('GET /tracks/filter?page=limit=categ=', () => {


});

describe('GET /tracks/:beatId', () => {


});

describe('GET /tracks/comments/:beatId?page=limit=', () => {


});

describe('GET /tracks/:beatId/download', () => {


});


//! [POST] TEST
describe('POST /tracks/:beatId', () => {




});



//! [PATCH] TEST
describe('PATCH /tracks/:beatId/closed', () => {




});