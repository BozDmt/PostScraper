import puppeteer from 'puppeteer'

(async ()=>{
    const browser = puppeteer.launch()
    const page = await browser.newPage()
})
