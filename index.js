const pup = require('puppeteer');

const url = "https://www.mercadolivre.com.br/";
const serachFor = "macbook";

let c = 1;
const list = [];

(async () => {
    const browser = await pup.launch({headless: true});
    const page = await browser.newPage();
    console.log('Bot inicializando...');

    await page.goto(url);
    console.log('Indo para url...');

    await page.waitForSelector('#cb1-edit');

    await page.type('#cb1-edit', serachFor);

    await Promise.all([
            page.waitForNavigation(),
            page.click('.nav-search-btn')
    ])

    const links = await page.$$eval('.ui-search-result__image > a', el => el.map(link => link.href));

    for(const link of links) {
        if(c === 10) continue;
        console.log('Página', c);
        await page.goto(link);
        await page.waitForSelector('.ui-pdp-title');

        const title = await page.$eval('.ui-pdp-title', element => element.innerText);
        const price = await page.$eval('.andes-money-amount__fraction', element => element.innerText);

        const seller = await page.evaluate(()=>{
            const el = document.querySelector('.ui-pdp-seller__link-trigger');
            if(!el) return null
            return el.innerText;
        });

        const obj = {};
        obj.tittle = title;
        obj.price = price;
        (seller ? obj.seller = seller : '');
        obj.link = link;
        
        list.push(obj);

        c++
    }

    console.log(list);

    await page.waitForNavigation();
    await browser.close();
    console.log('Finalizado.');
})()