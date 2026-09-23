const ClienteService = require("../services/ClienteService");

// Teste unitario: o service e testado em isolamento total.
// O repository e substituido por um mock (jest.fn()), assim testamos so a
// logica do service, sem depender de dados reais.
//
// Abaixo ha 1 teste pronto (listar) como referencia de estilo.
// Os demais estao como test.todo — implemente cada um seguindo o ENUNCIADO-02-CLIENTES.md.

describe("ClienteService (unitario com mocks)", () => {
  let service;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    service = new ClienteService(mockRepository);
  });

   describe("Listar", () => {
    test("chama repository.findAll uma vez e retorna o resultado", () => {
      const produtos = [{ id: 1, nome: "Coxinha", preco: 5 }];
      mockRepository.findAll.mockReturnValue(produtos);

      const resultado = service.listar();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(produtos);
    });
  });

  describe("Buscar por ID", () => {
    test("chama repository.findById com o id e retorna o resultado", () => {
      const produto = { id: 1, nome: "Coxinha", preco: 10 };
      mockRepository.findById.mockReturnValue(produto);

      const resultado = service.buscarPorId(1);

      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(resultado).toEqual(produto);
    });
  });

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