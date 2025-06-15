import { configDotenv} from "dotenv"
import puppeteer from "puppeteer"

configDotenv()

export default async function gets(){
    function wait(ms){
        return new Promise(resolve=>setTimeout(resolve,ms))
    }

    async function gotoCategory(pageCtx,link){
        await pageCtx.goto(link)
        await wait(1000)
        const numPages = await pageCtx.$eval('.facetwp-page.last',page=>page.textContent)
        await(300)
        let  jobListings
        for(let i = 2; i <= numPages; ++i){
            await wait(100)
            jobListings = await pageCtx.$$eval('div.job-list-item.is-premium div.inner-left.company-logo-wrap a.overlay-link.ab-trigger',(listings)=>{
                return listings.map(listing=>listing.getAttribute('href'))
            })
            const jobs = [...jobListings]

            for(let k = 0; k < jobs.length; ++k){
                await pageCtx.goto(jobs[k])
                await wait(1000)
                await pageCtx.click('.button.button-send.apply-button.bold.button-with-icon')
                
                //await pageCtx.click('.upload-from-profile.button.button-with-icon')
                //await pageCtx.click('.wpcf7-form-control.wpcf7-user_files')
                //await pageCtx.click('.wpcf7-form-control.wpcf7-submit.button.so-has-old-value')
                await wait(500)
            }
            await pageCtx.goto(`${link}?_paged=${i}`)
            await wait(200) 

        }
    }


    try{
        const browser = await puppeteer.launch({headless:false})
        const context = await browser.createBrowserContext()
        const page = await context.newPage()
        await page.setDefaultTimeout(10000)
        await page.setViewport({width:1920,height:1080})

        let source
        let time = new Date().getTime()

        await page.goto('https://dev.bg')
        await wait(2000)
        await page.click('button.cky-btn.cky-btn-accept')

        const categoryLinks = await page.$$eval('.show-all-jobs-cat', (elements)=>{
            return elements.map((elem)=>
                 elem.getAttribute('href')
            )
        })

        const links = [...categoryLinks]

        await wait(100)


        for(const link of links){
            await gotoCategory(page,link)
        }

        await browser.close()

    }catch(e){
        console.log(e)
    }
}
gets()
