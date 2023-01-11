import request from 'supertest'; 
import { expect } from 'chai';
import config from "../config";
import app from '../index';
import { producerId10profile, producerId10vocalComponent, vocalId4profile } from './constant';

const producerToken = process.env.PRODUCER_TOKEN as string;
const vocalToken = process.env.VOCAL_TOKEN as string;

//! [GET] TEST
describe('GET /profile/producer/:producerId?page=limit=', () => {
    it('프로듀서 프로필 조회 성공', done => {
        request(app)
            .get('/profile/producer/10')
            .set('Content-Type', 'application/json')
            .set('Authorization', producerToken)
            .query({
                page: 1,
                limit: 2,
            })
            .then((res) => {
                expect(res.status).to.eql(200);
                expect(res.body.message).to.eql("프로듀서 프로필 조회 성공");
                expect(res.body.data).to.eql(producerId10profile);
                done();
            })
            .catch(err => {
                console.error('[ERROR] : ', err);
                done(err);
            })
    });

});

describe('GET /profile/producer/:producerId/beats?page=limit=', () => {
    it('보컬 구하는 중 탭 조회 성공', done => {
        request(app)
            .get('/profile/producer/10/beats')
            .set('Content-Type', 'application/json')
            .set('Authorization', producerToken)
            .query({
                page: 1,
                limit: 2,
            })
            .then((res) => {
                expect(res.status).to.eql(200);
                expect(res.body.message).to.eql("보컬 구하는 중 탭 조회 성공");

                const { beatList } = res.body.data;
                expect( beatList ).to.eql(producerId10vocalComponent);
                done();
            })
            .catch(err => {
                console.error('[ERROR] : ', err);
                done(err);
            })
    });

});

describe('GET /profile/vocal/:vocalId?page=limit=', () => {
    it('보컬 프로필 조회 성공', done => {
        request(app)
            .get('/profile/vocal/4')
            .set('Content-Type', 'application/json')
            .set('Authorization', vocalToken)
            .query({
                page: 1,
                limit: 2,
            })
            .then((res) => {
                expect(res.status).to.eql(200);
                expect(res.body.message).to.eql("보컬 프로필 조회 성공");
                expect(res.body.data).to.eql(vocalId4profile);
                done();
            })
            .catch(err => {
                console.error('[ERROR] : ', err);
                done(err);
            })
    });

});