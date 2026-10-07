import { test, expect } from "@playwright/test";

//reseta a teste anterior
test.beforeEach(async ({ page, request }) => {
  const resposta = await request.post("http://localhost:3000/__reset");
  expect(resposta.status()).toBe(204);
  await page.goto("/");
});

test("C1: Listar os clientes iniciais", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Clientes" })).toBeVisible();

    await expect(page.getByRole("row")).toHaveCount(3);
    await expect(page.getByRole("cell", { name: "Ana Souza" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Bruno Lima"})).toBeVisible();
});

test("C2: Cadastrar um cliente novo", async ({ page }) => {
    await page.getByLabel("Nome").fill("Carla Dias");
    await page.getByLabel("Email").fill("carla@email.com");
    await page.getByRole("button", { name: "Cadastrar"}).click();

    const linha = page.getByRole("row", { name: /Carla Dias/ });
    await expect(linha).toBeVisible();
    await expect(linha).toContainText("carla@email.com")
    
    await expect(page.getByLabel("Nome")).toHaveValue("");
    await expect(page.getByLabel("Email")).toHaveValue("");
})

test("C3: Validar campos obrigatórios", async ({ page }) => {
  await page.getByRole("button", { name: "Cadastrar" }).click();
  await expect(page.getByText("Nome e email sao obrigatorios")).toBeVisible();
  await expect(page.getByRole("row")).toHaveCount(3);
});

test("C4: Impedir email duplicado", async ({ page }) => {
  await page.getByLabel("Nome").fill("Teste");
  await page.getByLabel("Email").fill("ana@email.com");
  await page.getByRole("button", { name: "Cadastrar" }).click();

  await expect(page.getByText("Email ja cadastrado")).toBeVisible();
  await expect(page.getByRole("row")).toHaveCount(3);
});

test("C5: Editar um cliente", async ({ page }) => {
  const linhaBruno = page.getByRole("row", { name: /Bruno Lima/ });
  await linhaBruno.getByRole("button", { name: "Editar" }).click();

  // Verifica formulário em estado de edição
  await expect(page.getByLabel("Nome")).toHaveValue("Bruno Lima");
  await expect(page.getByLabel("Email")).toHaveValue("bruno@email.com");
  await expect(page.getByRole("button", { name: "Salvar" })).toBeVisible();

  await page.getByLabel("Nome").fill("Bruno Lima Silva");
  await page.getByRole("button", { name: "Salvar" }).click();

  await expect(page.getByRole("row", { name: /Bruno Lima Silva/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Cancelar" })).not.toBeVisible();
  await expect(page.getByLabel("Nome")).toHaveValue("");
});

test("C6: Cancelar edição", async ({ page }) => {
  const linhaAna = page.getByRole("row", { name: /Ana Souza/ });
  await linhaAna.getByRole("button", { name: "Editar" }).click();

  await page.getByLabel("Nome").fill("Ana Souza Alterada");
  await page.getByRole("button", { name: "Cancelar" }).click();

  await expect(page.getByLabel("Nome")).toHaveValue("");
  await expect(page.getByRole("cell", { name: "Ana Souza" })).toBeVisible();
  await expect(page.getByText("Ana Souza Alterada")).not.toBeVisible();
});

test("C7: Editar para um email já usado", async ({ page }) => {
  const linhaBruno = page.getByRole("row", { name: /Bruno Lima/ });
  await linhaBruno.getByRole("button", { name: "Editar" }).click();

  await page.getByLabel("Email").fill("ana@email.com");
  await page.getByRole("button", { name: "Salvar" }).click();

  await expect(page.getByText("Email ja cadastrado")).toBeVisible();
  await expect(linhaBruno).toContainText("bruno@email.com");
});

test("C8: Remover um cliente", async ({ page }) => {
  const linhaBruno = page.getByRole("row", { name: /Bruno/ });
  await linhaBruno.getByRole("button", { name: "Remover" }).click();

  await expect(linhaBruno).toHaveCount(0);
  await expect(page.getByRole("row")).toHaveCount(2); // Cabeçalho + 1 cliente
});

test("C9 (desafio): Fluxo completo de cliente", async ({ page }) => {
  //Cadastra o Diego
  await page.getByLabel("Nome").fill("Diego");
  await page.getByLabel("Email").fill("diego@email.com");
  await page.getByRole("button", { name: "Cadastrar" }).click();
  const linhaDiego = page.getByRole("row", { name: /Diego/ });
  await expect(linhaDiego).toBeVisible();

  // Edita o nome para Diego Matos
  await linhaDiego.getByRole("button", { name: "Editar" }).click();
  await page.getByLabel("Nome").fill("Diego Matos");
  await page.getByRole("button", { name: "Salvar" }).click();
  const linhaDiegoMatos = page.getByRole("row", { name: /Diego Matos/ });
  await expect(linhaDiegoMatos).toBeVisible();

  // Tenta cadastrar o segundo cliente com mesmo email
  await page.getByLabel("Nome").fill("Diego Fake");
  await page.getByLabel("Email").fill("diego@email.com");
  await page.getByRole("button", { name: "Cadastrar" }).click();
  await expect(page.getByText("Email ja cadastrado")).toBeVisible();

  // Remove o Diego Matos
  await linhaDiegoMatos.getByRole("button", { name: "Remover" }).click();
  await expect(linhaDiegoMatos).toHaveCount(0);

  //Contagem final 
  await expect(page.getByRole("row")).toHaveCount(3);
});

