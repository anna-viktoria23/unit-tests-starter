const request = require('supertest')

const createApp = require('../app')

describe('API /produtos testes de integração', () => {
    let app;

    beforeEach(() => {
        app = createApp()
    })

    describe('Get /produtos', () => {
        test('retorna 200 e um array com os produtos iniciais', async () => {
            // chama o supertest
            const res = await request(app).get('/produtos')

            //tudo que vem dentro da requisição, pega no res
            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            //tamanho do body
            expect(res.body.length).toBe(3) //ver erro
        })

        describe('Get /produtos/:id', () => {
            test('Retorna 200 e o produto identificado pelo ID', async () => {
                const res = await request(app).get('/produtos/1')
                
                expect(res.status).toBe(200)
                expect(res.body.id).toBe(1)
                expect(res.body.nome).toBe('Coxinha')
            })
        })

        describe('POST /produtos', () => {
    test('Deve retornar 201 e o produto criado com id gerado', async () => {
      const payload = { nome: 'Bronwie', preco: 7 };

      const res = await request(app).post('/produtos').send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.nome).toBe('Bronwie');
      expect(res.body.preco).toBe(7);
    });

    test('Deve retornar 400 com { erro: ... } quando o nome estiver faltando', async () => {
      const payload = { preco: 10 };

      const res = await request(app).post('/produtos').send(payload);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro');
      expect(res.body.erro).toContain('Nome');
    });

    test('Deve retornar 400 com { erro: ... } quando o preco estiver faltando', async () => {
      const payload = { nome: 'Cachorro-quente' };

      const res = await request(app).post('/produtos').send(payload);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro');
      expect(res.body.erro).toContain('preco');
    });

    test('O produto criado deve aparecer em uma chamada seguinte a GET /produtos', async () => {
      const payload = { nome: 'Palha Italiana', preco: 9 };

      await request(app).post('/produtos').send(payload);
      const res = await request(app).get('/produtos');

      expect(res.status).toBe(200);
      expect(res.body.some((produto) => produto.nome === 'Palha Italiana')).toBe(true);
    });
  });

  describe('DELETE /produtos/:id', () => {
    test('Deve retornar 204 quando o produto e removido com sucesso', async () => {
      const res = await request(app).delete('/produtos/1');

      expect(res.status).toBe(204);
    });

    test('O produto removido nao deve mais aparecer em GET /produtos/:id (deve retornar 404)', async () => {
      await request(app).delete('/produtos/1');
      const res = await request(app).get('/produtos/1');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('erro');
    });

    test('Deve retornar 404 com { erro: ... } quando o produto nao existir', async () => {
      const res = await request(app).delete('/produtos/999');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('erro', 'Produto nao encontrado');
    });
  });
});
})
