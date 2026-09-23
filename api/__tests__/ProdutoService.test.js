const ProdutoService = require("../services/ProdutoService")

describe('ProdutoService - testes Uniários com Mocks', () =>{
    let services
    let mockRepository

    beforeEach(() => {
        mockRepository = {
            // retorna vazio
            findAll: jest.fn(), 
            findById: jest.fn(),
            create: jest.fn(),
            delete: jest.fn()
        }  
        service = new ProdutoService(mockRepository)  
    })

    describe ('Listar', () => {
    test('Chama repository.findAll uma vez e retorna o resultado', () => {
        const produtos =[{id: 1, nome: "Coxinha", preco: 5}]
        mockRepository.findAll.mockReturnValue(produtos)

        const resultado = service.listar()

        //Confere se tudo está certo
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1)

        //resultado igual os produtos
        expect(resultado).toEqual(produtos)
    })

    describe ('Buscar por id', () => {
        test('Tem que encontrar o produto por .findByID', () => {
            const produtoEsperado = [{id: 1, nome:"Coxinha", preco: 5}]
            mockRepository.findById.mockReturnValue(produtoEsperado)

            const resposta = service.buscarPorId(1) //como é chamado no service

        expect(mockRepository.findById).toHaveBeenCalledWith(1) //verifica se chamou pelo id certo
        expect(mockRepository.findById).toHaveBeenCalledTimes(1) 
        expect(resposta).toEqual(produtoEsperado)
        })
    })

    //criar caso de teste para: 'buscar por id'
})
})
