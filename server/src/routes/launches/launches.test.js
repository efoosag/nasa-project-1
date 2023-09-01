const request = require('supertest');
const { mongoConnect } = require('../../services/mongo');
const app = require('../../app');
const { loadPlanetsData } = require('../../model/planets.model');

describe('Launch Api', () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  })

  describe('Test GET lauches', () => {
    test('it should response with 200 success', async () => {
      const response = await request(app).get('/v1/launches')
      .expect('Content-Type', /json/)
      .expect(200);
    })
  });
  
  describe('Test POST launch', () => {
    const completeLaunchData = {
      mission: 'US Enterprise',
      rocket: 'waolock',
      target: 'Kepler-62 f',
      launchDate: 'July 12, 2060',
    }
  
    const launchDataWithoutDate = {
      mission: 'US Enterprise',
      rocket: 'waolock',
      target: 'Kepler-62 f',
    }
  
    const launchDataWithInvalidDate = {
      mission: 'US Enterprise',
      rocket: 'waolock',
      target: 'Kepler-62 f',
      launchDate: 'fakeDate',
    }
  
    test('it should response with 201 success',  async ()=> {
      const response = await request(app)
      .post('/v1/launches')
      .send(completeLaunchData)
      .expect('Content-Type', /json/)
      .expect(201);
  
      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
  
      expect(requestDate).toBe(responseDate)
  
      expect(response.body).toMatchObject(launchDataWithoutDate)
    })
  
    test('it should catch missing required properties', async () => {
      const response = await request(app)
      .post('/v1/launches')
      .send(launchDataWithoutDate)
      .expect('Content-Type', /json/)
      .expect(400);
  
      expect(response.body).toStrictEqual({
        error: 'Missing Required Launch Property'
      })
    })
  
    test('it should catch invalid dates', async () => {
      const response = await request(app)
      .post('/v1/launches')
      .send(launchDataWithInvalidDate)
      .expect('Content-Type', /json/)
      .expect(400);
  
      expect(response.body).toStrictEqual({
        error: 'Invalid Launch Date',
      })
    })
  })
});

