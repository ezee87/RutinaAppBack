const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe('Metas Endpoints', () => {
  let token;
  let metaId;
  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
    // Registrar y loguear usuario
    const email = `meta${Date.now()}@mail.com`;
    const password = 'meta1234';
    await request(app).post('/api/auth/register').send({ nombre: 'MetaUser', email, password });
    const res = await request(app).post('/api/auth/login').send({ email, password });
    token = res.body.token;
  });

  it('no debería crear meta sin token', async () => {
    const res = await request(app)
      .post('/api/metas')
      .send({ nombre: 'Sin token', tipo: 'numerica', frecuencia: 'diaria', objetivoDiario: 1 });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('no debería crear meta con datos inválidos', async () => {
    const res = await request(app)
      .post('/api/metas')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: '', tipo: 'numerica' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('debería crear una meta', async () => {
    const res = await request(app)
      .post('/api/metas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Leer 10 páginas',
        tipo: 'numerica',
        frecuencia: 'diaria',
        objetivoDiario: 10
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('nombre', 'Leer 10 páginas');
    metaId = res.body._id;
  });

  it('debería obtener las metas', async () => {
    const res = await request(app)
      .get('/api/metas')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('debería modificar una meta', async () => {
    const res = await request(app)
      .put(`/api/metas/${metaId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Leer 20 páginas' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('nombre', 'Leer 20 páginas');
  });

  it('debería eliminar una meta', async () => {
    const res = await request(app)
      .delete(`/api/metas/${metaId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
