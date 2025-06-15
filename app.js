import puppeteer from "puppeteer"
import {configDotenv} from "dotenv"

configDotenv()
export default async function goTo(){

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
                
                await pageCtx.waitForSelector('.upload-from-profile.button.button-with-icon',{visible:true})
                await page.evaluate(()=>{
                    const el = document.querySelector('.upload-from-profile.button.button-with-icon')
                    if(el)
                        el.click()
                })
                await pageCtx.waitForSelector('.wpcf7-form-control.wpcf7-user_files',{visible:true})
                await pageCtx.evaluate(()=>{
                    const el = document.querySelector('.wpcf7-form-control.wpcf7-user_files')
                    if(el)
                        el.click()
                })
                
                await pageCtx.waitForSelector('.wpcf7-form-control.wpcf7-submit.button.so-has-old-value',{visible:true})
                await pageCtx.evaluate(()=>{
                    const el = document.querySelector('.wpcf7-form-control.wpcf7-submit.button.so-has-old-value')
                    if(el)
                        el.click()
                })
                await wait(500)
            }
            await pageCtx.goto(`${link}?_paged=${i}`)
            await wait(200) 

        }
    }

    const browser = await puppeteer.launch({
        headless:false,
        userDataDir: '/home/mitch/Downloads',
        devtools:false,
        browser:'chrome'
    })
    const context = await browser.createBrowserContext()
    //    let newLink
    const page = await context.newPage()
    await page.setViewport({width:1920,height:1080})
    await page.setDefaultNavigationTimeout(20000)
    //  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')

    try{
        await page.setDefaultTimeout(5000)
        await page.goto('https://dev.bg')
        await wait(2000)

        await page.click('button.cky-btn.cky-btn-accept')
    
        await page.click('a.button.secondary.subscriber-login-btn')
        
        await page.type('#username',process.env.ACC_NICK)
        await page.type('input#login-password',process.env.ACC_PASS)
        await page.click('input.button.button-primary.login-submit')
        await page.waitForNavigation()

        await wait(2000)

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
    }
    catch(e){
        console.log(e)
    }
}

goTo()
