import {defineConfig, devices} from "@playwright/test"

export default defineConfig({
    testDir: "./e2e",
    workers: 1,  //vai rodar um teste da cada vez
    reporter: "html",  //ja vem assim
    use: {
        baseURL: "http://localhost:5173"
    },
    projects: [{name: "chromium", use: {...devices["Desktop Chrome"]}}],  //indica o que vai usar e o que
    webServer: [
        {
            command: "npm run api:e2e",
            cwd: "..",
            url: "http://localhost:3000/produtos",
            reuseExistingServer: true,
        },
        {
            command: "npm run dev",
            url:"http://localhost:5173",
            reuseExistingServer:true,
        }
    ]
})