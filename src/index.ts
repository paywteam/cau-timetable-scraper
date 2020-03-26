import puppeteer from 'puppeteer'
import { signIn } from './sign-in'
import { loopCoverages } from './loop-coverages'
import { Account, ScrapeOptions } from './types'
import { atomize } from './atomize'
import { parse } from './parse'
import fs from 'fs'

const CTTS = async (account: Account, scrapeOptions: ScrapeOptions) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  })

  const page = await browser.newPage()
  page.setViewport({
    width: 1280,
    height: 800,
  })

  page.setMaxListeners(Infinity)

  page.on('console', msg => {
    for (let i = 0; i < msg.args().length; ++i) {
      console.log(`${msg.args()[i]}`)
    }
  })

  if (!fs.existsSync('data')) {
    fs.mkdirSync('data')
  }

  await signIn(page, account)
  const lectures = parse(atomize(await loopCoverages(page, scrapeOptions)))

  browser.close()

  return lectures
}

export { CTTS }
