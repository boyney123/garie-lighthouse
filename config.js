module.exports = {
    cron: "00 00 */6 * * *",
    urls: [
        {
            url: "https://www.google.com",
            plugins: [
                {
                    name: "lighthouse",
                    report: true,
                    init: async (url, page) => {
                        await page.goto(url);
                        await page.screenshot({ path: 'test.png' });
                    }
                }
            ]
        }
    ]
}
