import puppeteer from "puppeteer"
import * as fs from "fs"
import {configDotenv} from "dotenv"


configDotenv()

export default async function getSource(url, outFileDynamic){//get source of list page and job posting page
    try{
        const browser = await puppeteer.launch({headless:false})
        const context = await browser.createBrowserContext()
        const page = await context.newPage()
        await page.setViewport({width:1920,height:1080})

        await page.setDefaultTimeout(5000)
        await page.goto(url)
        let source
        let time = new Date().getTime()


        await page.goto('https://dev.bg')
//        await page.click('button.cky-btn.cky-btn-accept')
        await page.click('a.button.secondary.subscriber-login-btn')
        await page.getDefaultTimeout()
        await page.type('input#username',process.env.ACC_NICK)
        await page.type('input#login-password',process.env.ACC_PASS)
        await page.click('input.button.button-primary.login-submit')
        await page.waitForNavigation()
//up to here- the job categories page
        const categoryLinks = await page.$$eval('.show-all-jobs-cat', (elements)=>{
            elements.map((elem)=>{
                elem.getAttribute('href')
            })
        })

        //fs.writeFileSync(outFileDynamic+time,source, "utf8")

        await browser.close()
    }catch(e){
        console.error(e)
    }
}

getSource("https://dev.bg",`out.html`)
