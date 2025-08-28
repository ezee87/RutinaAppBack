const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe('Auth Endpoints', () => {
  let testEmail = `test${Date.now()}@mail.com`;
  let testPassword = 'test1234';

  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
  });

  it('debería registrar un usuario nuevo', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'TestUser',
        email: testEmail,
        password: testPassword
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Usuario registrado');
    expect(res.body.user).toHaveProperty('email', testEmail);
  });

  it('no debería registrar usuario con email ya registrado', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'TestUser',
        email: testEmail,
        password: testPassword
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Email ya registrado');
  });

  it('no debería registrar usuario con datos faltantes', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'faltante@mail.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('debería loguear un usuario y devolver un token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: testPassword
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', testEmail);
  });

  it('no debería loguear con credenciales incorrectas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'incorrecta' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Credenciales incorrectas');
  });

  it('no debería loguear usuario inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noexiste@mail.com', password: 'algo' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Usuario no encontrado');
  });
});
