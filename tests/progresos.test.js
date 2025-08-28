const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe('Progresos Endpoints', () => {
  let token;
  let metaId;
  let progresoId;
  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
    // Registrar y loguear usuario
    const email = `prog${Date.now()}@mail.com`;
    const password = 'prog1234';
    await request(app).post('/api/auth/register').send({ nombre: 'ProgUser', email, password });
    const res = await request(app).post('/api/auth/login').send({ email, password });
    token = res.body.token;
    // Crear meta
    const metaRes = await request(app)
      .post('/api/metas')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Meta para progreso', tipo: 'numerica', frecuencia: 'diaria', objetivoDiario: 1 });
    metaId = metaRes.body._id;
  });

  it('debería crear un progreso', async () => {
    const res = await request(app)
      .post('/api/progresos')
      .set('Authorization', `Bearer ${token}`)
      .send({ meta: metaId, fecha: '2025-08-28', valor: 1 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('meta', metaId);
    progresoId = res.body._id;
  });

  it('debería obtener los progresos', async () => {
    const res = await request(app)
      .get('/api/progresos')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('debería modificar un progreso', async () => {
    const res = await request(app)
      .put(`/api/progresos/${progresoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ valor: 2 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('valor', 2);
  });

  it('debería eliminar un progreso', async () => {
    const res = await request(app)
      .delete(`/api/progresos/${progresoId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('no debería crear progreso sin token', async () => {
    const res = await request(app)
      .post('/api/progresos')
      .send({ meta: metaId, fecha: '2025-08-28', valor: 1 });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('no debería crear progreso con datos inválidos', async () => {
    const res = await request(app)
      .post('/api/progresos')
      .set('Authorization', `Bearer ${token}`)
      .send({ meta: '', fecha: '', valor: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});
