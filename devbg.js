const puppeteer = require('puppeteer');
require('dotenv').config();
// 'https://dev.bg/company/jobs/front-end-development/'
(async()=>{
    const browser = await puppeteer.launch({
        headless:true,
    })
    const page = await browser.newPage()
    // const locator = await new puppeteer.Locator()
    await page.setViewport({width:1920,height:1080})
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0')
    console.log('Reaching for dev.bg') 
    
    await page.goto('https://dev.bg',{waitUntil:'networkidle2'})

    const categories = await page.$$('div.category-block > .category-block-title-holder')
    // for(cat of categories){
    //     const link = await cat.$eval('a.category-name',node=>node.href)
        
    // }

    
    await page.getDefaultNavigationTimeout()
    await page.click('button.cmplz-btn.cmplz-accept')
    const aLink = await page.$('div.inner-left.company-logo-wrap')    
    const links = await page.$$('div.inner-left.company-logo-wrap')
    for(link of links){
        const linkHref = await link.$eval('a.overlay-link.ab-trigger',node=>node.href)
        console.log(linkHref)
    }
    await console.log(page.$('a.overlay-link.ab-trigger'))
    const newLink = await aLink.$eval('a.overlay-link.ab-trigger',node=>node.href)
    await console.log(newLink)
    
    if(newLink.length > 1){
        await page.goto(newLink)
        await page.click('a.button.button-send.apply-button.bold.button-with-icon')
    }
    const nextPage = aLink.frame
    console.log(nextP)
    await aLink.click('a.button.button-send.apply-button.bold.button-with-icon')
    
    await page.click('button.cmplz-btn.cmplz-accept')
    await page.click('a.button.secondary.bold.subscriber-login-btn')
    await page.getDefaultTimeout()
    try{
        await page.click('input#login-password')
        // for(let i = 0; i<10; i++){
        //     await setTimeout(()=>{
        //         const passwd = page.$('input#login-password')
        //         page.type(passwd,process.env.password)
        //     },500) 
        // }
        // const passwd = await page.$('input#login-password')
        // await passwd.focus
        await page.type('input#login-password',process.env.password)

    }catch(e){
        console.log(e)
    }
})()