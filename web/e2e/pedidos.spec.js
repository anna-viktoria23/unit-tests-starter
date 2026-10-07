import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page, request }) => {
  const resposta = await request.post("http://localhost:3000/__reset");
  expect(resposta.status()).toBe(204);
  await page.goto("/");
  // Navega para a aba de Pedidos
  await page.getByRole("button", { name: "Pedidos" }).click();

  // Garante que os dados do formulário carregaram
  const selectCliente = page.getByLabel("Cliente");
  await expect(selectCliente).toContainText("Ana Souza");
});

test("P1: Listar os pedidos iniciais", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Pedidos" })).toBeVisible();

  const linhaPedido1 = page.getByRole("row", { name: /#1/ });
  await expect(linhaPedido1).toContainText("Ana Souza");
  await expect(linhaPedido1).toContainText("2x Coxinha");
  await expect(linhaPedido1.getByRole("cell", { name: "R$ 10,00" })).toBeVisible();
  await expect(page.getByLabel("Status do pedido 1")).toHaveValue("pendente");
});

test("P2: Montar um pedido com um item", async ({ page }) => {
  await page.getByLabel("Cliente").selectOption({ label: "Bruno Lima" });
  await page.getByLabel("Produto").selectOption({ label: "Pastel" });
  await page.getByRole("button", { name: "Adicionar item" }).click();

 
  await expect(page.getByText("1x Pastel")).toBeVisible();

  await page.getByRole("button", { name: "Criar pedido" }).click();

  const novaLinha = page.getByRole("row", { name: /Bruno Lima/ });
  await expect(novaLinha).toBeVisible();
  await expect(novaLinha).toContainText("1x Pastel");
  await expect(novaLinha).toContainText("R$ 8,00");
  
  // Limpeza dos campos
  await expect(page.getByLabel("Cliente")).toHaveValue("");
  await expect(page.getByText("1x Pastel")).not.toBeVisible();
});

test("P3: Montar um pedido com vários itens e quantidades", async ({ page }) => {
  await page.getByLabel("Cliente").selectOption({ label: "Ana Souza" });

  
  await page.getByLabel("Produto").selectOption({ label: "Coxinha" });
  await page.getByLabel("Quantidade").fill("3");
  await page.getByRole("button", { name: "Adicionar item" }).click();

  await page.getByLabel("Produto").selectOption({ label: "Empada" });
  await page.getByLabel("Quantidade").fill("1");
  await page.getByRole("button", { name: "Adicionar item" }).click();

  await page.getByRole("button", { name: "Criar pedido" }).click();

  // Valida total de R$ 21,00 (3x8 + 1x6 = R$ 30 - nota: a API calcula com base na tabela do seed)
  const linhaPedido = page.getByRole("row", { name: /3x Coxinha, 1x Empada/ });
  await expect(linhaPedido).toBeVisible();
  await expect(linhaPedido).toContainText("R$ 30,00");
});

test("P4: Quantidade volta a 1 após adicionar item", async ({ page }) => {
  await page.getByLabel("Quantidade").fill("5");
  await page.getByRole("button", { name: "Adicionar item" }).click();

  await expect(page.getByLabel("Quantidade")).toHaveValue("1");
});

test("P5: Não criar pedido sem cliente", async ({ page }) => {
  await page.getByLabel("Produto").selectOption({ label: "Coxinha" });
  await page.getByRole("button", { name: "Adicionar item" }).click();

  await page.getByRole("button", { name: "Criar pedido" }).click();

  await expect(page.getByText("Cliente e obrigatorio")).toBeVisible();
  await expect(page.getByRole("row")).toHaveCount(2); // 
});

test("P6: Não criar pedido sem itens", async ({ page }) => {
  await page.getByLabel("Cliente").selectOption({ label: "Ana Souza" });
  await page.getByRole("button", { name: "Criar pedido" }).click();

  await expect(page.getByText("Pedido deve ter ao menos um item")).toBeVisible();
});

test("P7: Alterar o status de um pedido", async ({ page }) => {
  const selectStatus = page.getByLabel("Status do pedido 1");
  await selectStatus.selectOption("pago");

  await expect(selectStatus).toHaveValue("pago");
});

test("P8: Pedido cancelado não pode ser alterado", async ({ page }) => {
  const selectStatus = page.getByLabel("Status do pedido 1");
  
  // Cancela o pedido
  await selectStatus.selectOption("cancelado");
  await expect(selectStatus).toHaveValue("cancelado");

  // Tenta alterar o status para pago
  await selectStatus.selectOption("pago");

  await expect(page.getByText("Pedido cancelado nao pode ser alterado")).toBeVisible();
  await expect(selectStatus).toHaveValue("cancelado");
});

test("P9: Remover um pedido", async ({ page }) => {
  const linhaPedido = page.getByRole("row", { name: /#1/ });
  await linhaPedido.getByRole("button", { name: "Remover" }).click();

  await expect(linhaPedido).toHaveCount(0);
  await expect(page.getByRole("row")).toHaveCount(1); 
});

test("P10 (desafio): Ciclo completo do pedido", async ({ page }) => {
  //Cria o pedido para Bruno Lima com 2x Empada
  await page.getByLabel("Cliente").selectOption({ label: "Bruno Lima" });
  await page.getByLabel("Produto").selectOption({ label: "Empada" });
  await page.getByLabel("Quantidade").fill("2");
  await page.getByRole("button", { name: "Adicionar item" }).click();
  await page.getByRole("button", { name: "Criar pedido" }).click();

  const linhaPedidoNovo = page.getByRole("row", { name: /Bruno Lima/ });
  await expect(linhaPedidoNovo).toBeVisible();

  //Pega o id do novo pedido a partir da interface (supondo Pedido #2)
  const selectStatusNovo = page.getByLabel(/Status do pedido/).nth(1);

  //Marca como pago
  await selectStatusNovo.selectOption("pago");
  await expect(selectStatusNovo).toHaveValue("pago");

  //Cancela
  await selectStatusNovo.selectOption("cancelado");
  await expect(selectStatusNovo).toHaveValue("cancelado");

  //Tenta voltar para pendente (deve falhar)
  await selectStatusNovo.selectOption("pendente");
  await expect(page.getByText("Pedido cancelado nao pode ser alterado")).toBeVisible();
  await expect(selectStatusNovo).toHaveValue("cancelado");

  //Remove
  await linhaPedidoNovo.getByRole("button", { name: "Remover" }).click();
  await expect(linhaPedidoNovo).toHaveCount(0);
});