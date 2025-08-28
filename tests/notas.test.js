const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe('Notas Endpoints', () => {
  let token;
  let notaId;
  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
    // Registrar y loguear usuario
    const email = `nota${Date.now()}@mail.com`;
    const password = 'nota1234';
    await request(app).post('/api/auth/register').send({ nombre: 'NotaUser', email, password });
    const res = await request(app).post('/api/auth/login').send({ email, password });
    token = res.body.token;
  });

  it('no debería crear nota sin token', async () => {
    const res = await request(app)
      .post('/api/notas')
      .send({ fecha: '2025-08-28', texto: 'Sin token' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('no debería crear nota con datos inválidos', async () => {
    const res = await request(app)
      .post('/api/notas')
      .set('Authorization', `Bearer ${token}`)
      .send({ fecha: '', texto: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('debería crear una nota', async () => {
    const res = await request(app)
      .post('/api/notas')
      .set('Authorization', `Bearer ${token}`)
      .send({ fecha: '2025-08-28', texto: 'Hoy me sentí motivado' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('texto', 'Hoy me sentí motivado');
    notaId = res.body._id;
  });

  it('debería obtener las notas', async () => {
    const res = await request(app)
      .get('/api/notas')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('debería modificar una nota', async () => {
    const res = await request(app)
      .put(`/api/notas/${notaId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ texto: 'Nota modificada' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('texto', 'Nota modificada');
  });

  it('debería eliminar una nota', async () => {
    const res = await request(app)
      .delete(`/api/notas/${notaId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
