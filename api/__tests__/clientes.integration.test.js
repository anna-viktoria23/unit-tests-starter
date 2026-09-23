const request = require('supertest');
const createApp = require('../app');

// Teste de integracao: testa a API de ponta a ponta via HTTP real.
// Cada teste recebe uma app nova (factory), garantindo estado isolado.
//
// Abaixo ha 1 teste pronto (GET /clientes) como referencia de estilo.
// Os demais estao como test.todo — implemente cada um seguindo o ENUNCIADO-02-CLIENTES.md.

describe('API /clientes (integracao com supertest)', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /clientes', () => {
    test('retorna 200 e um array com os clientes iniciais', async () => {
      const res = await request(app).get('/clientes');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /clientes/:id', () => {
    test.todo('retorna 200 e o cliente quando o id existe', async () => {
      const res = await request(app).get('clientes/1')
      
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('id',1)
      expect(res.body.nome).toBe('Ana Souza')
      expect(res.body.email).toBe('ana@email.com')
    });

    test.todo('retorna 404 com mensagem de erro quando o cliente nao existe', async () => {
      
      const res = await request(app).get('/clientes/999')

      expect(res.status).toBe(404)
      expect(res.body).toHaveProperty('erro', 'cliente não encontrado')
    });
  });

  describe('POST /clientes', () => {
    test('retorna 201 e o cliente criado com id gerado', async () => {
      const payload = { nome: 'Lila Vivian', email: 'lila@email.com' };

      const res = await request(app).post('/clientes').send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.nome).toBe('Lila Vivian');
      expect(res.body.email).toBe('lila@email.com');
    });

    test('retorna 400 quando o nome esta faltando', async () => {
      const payload = { email: 'novo@email.com' };

      const res = await request(app).post('/clientes').send(payload);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro');
      expect(res.body.erro).toContain('Nome');
    });

    test('retorna 400 quando o email esta faltando', async () => {
      const payload = { nome: 'Novo Cliente' };

      const res = await request(app).post('/clientes').send(payload);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro');
      expect(res.body.erro).toContain('email');
    });

    test('retorna 400 quando o email ja esta cadastrado', async () => {
      const payload = { nome: 'Ana Souza', email: 'ana@email.com' };

      const res = await request(app).post('/clientes').send(payload);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro', 'Email ja cadastrado');
    });

    test('cliente criado aparece em GET /clientes', async () => {
      const payload = { nome: 'Vivian', email: 'vivian@email.com' };

      await request(app).post('/clientes').send(payload);
      const res = await request(app).get('/clientes');

      expect(res.status).toBe(200);
      expect(res.body.some((cliente) => cliente.email === 'vivian@email.com')).toBe(true);
    });
  });

  describe('PUT /clientes/:id', () => {
    test('retorna 200 e o cliente atualizado quando o id existe', async () => {
      const payload = { nome: 'Carla', email: 'carla@email.com' };

      const res = await request(app).put('/clientes/1').send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body.nome).toBe('Carla');
      expect(res.body.email).toBe('carla@email.com');
    });

    test('retorna 404 quando o cliente nao existe', async () => {
      const payload = { nome: 'Cliente Inexistente', email: 'inexis@email.com' };

      const res = await request(app).put('/clientes/999').send(payload);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('erro', 'Cliente nao encontrado');
    });

    test('retorna 400 quando o novo email ja pertence a outro cliente', async () => {
      const payload = { email: 'caio@email.com' };

      const res = await request(app).put('/clientes/1').send(payload);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro', 'Email ja cadastrado');
    });
  });

  describe('DELETE /clientes/:id', () => {
    test('retorna 204 quando o cliente e removido com sucesso', async () => {
      const res = await request(app).delete('/clientes/2');

      expect(res.status).toBe(204);
    });

    test('cliente removido nao aparece mais na listagem', async () => {
      await request(app).delete('/clientes/2');
      const res = await request(app).get('/clientes/2');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('erro', 'Cliente nao encontrado');
    });

    test('retorna 404 quando o cliente nao existe', async () => {
      const res = await request(app).delete('/clientes/999');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('erro', 'Cliente nao encontrado');
    });
  });
});