import request from 'supertest'; 
import { expect } from 'chai';
import app from '../index';
import { filteredVocals } from './constant';

const producerToken = process.env.PRODUCER_TOKEN as string;
const vocalToken = process.env.VOCAL_TOKEN as string;

//! [GET] TEST

describe('GET /vocals/filter?page=limit=categ=isSelected', () => {
    it('보컬 검색 성공', done => {
        request(app)
            .get('/vocals/filter')
            .set('Content-Type', 'application/json')
            .set('Authorization', producerToken)
            .query({
                page: 1,
                limit: 2,
                categ: [2,4,7],
            })
            .then((res) => {
                expect(res.status).to.eql(200);
                expect(res.body.message).to.eql("보컬 검색 창 조회 성공");

                const { vocalList } = res.body.data;
                expect(vocalList).to.eql(filteredVocals);

                done();
            })
            .catch(err => {
                console.error('[ERROR] : ', err);
                done(err);
            })
    });
});