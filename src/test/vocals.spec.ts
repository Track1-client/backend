import request from 'supertest'; 
import expect from 'chai';
import app from '../index';

const producerToken = process.env.PRODUCER_TOKEN as string;
const vocalToken = process.env.VOCAL_TOKEN as string;

//! [GET] TEST
describe('GET /vocals?page=limit=', () => {


});

describe('GET /vocals/filter?page=limit=categ=isSelected', () => {


});