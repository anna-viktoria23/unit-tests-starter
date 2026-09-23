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

        //criar caso de teste do get/produtos/:id toBe para verificar o mock (body.nome) to be ("Coxinha") expect
    })
})