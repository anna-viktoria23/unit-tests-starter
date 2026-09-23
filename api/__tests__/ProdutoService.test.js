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
    describe("Criar dados", () => {
    test("deve repassar dados para mockRepository.create e retornar o produto criado", () => {
      const dados = { nome: "Coxinha", preco: 12 };
      const produtoCriado = { id: 1, ...dados };
      mockRepository.create.mockReturnValue(produtoCriado);

      const resultado = service.criar(dados);

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith(dados);
      expect(resultado).toEqual(produtoCriado);
    });

    test("deve propagar o erro lancado pelo repository quando os dados forem invalidos", () => {
      const dadosInvalidos = { nome: "", preco: -1 };
      mockRepository.create.mockImplementation(() => {
        throw new Error("Nome e preco sao obrigatorios");
      });

      expect(() => service.criar(dadosInvalidos)).toThrow(
        "Nome e preco sao obrigatorios"
      );
    });
  });

  describe("Remover", () => {
    test("deve chamar mockRepository.delete com o id correto quando o produto existe", () => {
      mockRepository.delete.mockReturnValue(true);

      expect(() => service.remover(1)).not.toThrow();
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    test("deve lancar erro 'Produto nao encontrado' quando o repository retornar false", () => {
      mockRepository.delete.mockReturnValue(false);

      expect(() => service.remover(999)).toThrow("Produto nao encontrado");
      expect(mockRepository.delete).toHaveBeenCalledWith(999);
    });
  });
});
})

