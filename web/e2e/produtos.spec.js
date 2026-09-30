import {test, expect} from "@playwright/test";

test.beforeEach(async ({page, request}) => {
    const resposta = await request.post("http://localhost:3000/__reset");
    expect(resposta.status()).toBe(204);
    await page.goto("/");
})

test("Lista os produtos iniciais", async ({page}) => {
    await expect(page.getByRole("heading", {name: "Produtos" })). toBeVisible()
    await expect (page.getByRole("row")).toHaveCount(4);
    await expect (page.getByRole("Cell", {nome: "Coxinha"})).toBeVisible();
})

test("cadastra um produto novo", async ({page}) => {
    await page.getByLabel("Nome").fill("Kibe");
    await page.getByLabel("preco".fill("7"));
    await page.getByRole("button", {name: "cadastrar"}).click();

    const linha = page.getByRole("row", {name: /kibe/ });
    await expect(linha).toBeVisible();
    await expect(linha).toContainText("R$ 7,00");
});

test("mostra erro ao cadastrar sem preenchimento", async ({page}) => {
    await page.getByRole("button", {name: "cadastrar"}).click();
    await expect(page.getByText("Nome e preco sao obrigatorios")).toBeVisible();
});

test("remove um produto", async ({page}) => {
    const linha = page.getByRole("row", {nme: /pastel/ });
    await linha.getByRole("button", {name: "Remover"}).click();
    await expect(linha).toHaveCount(0);
})