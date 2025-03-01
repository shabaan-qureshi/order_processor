const request = require('supertest');
const express = require('express');
const app = express();

app.get('/metrics', (req, res) => {
  res.status(200).json({ average_processing_time: 5 });
});

describe('GET /metrics', () => {
  it('should return the average processing time', async () => {
    const response = await request(app).get('/metrics');
    expect(response.status).toBe(200);
    console.log(response)
    expect(response.body.average_processing_time).toEqual(5);
  });
});
