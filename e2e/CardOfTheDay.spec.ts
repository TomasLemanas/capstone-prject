import { test, expect } from '@playwright/test'

test.describe('Card of the Day Page interactions', () => {
  test('should allow drawing a card, viewing its detail, saving the reading and deleting it', async ({
    page
  }) => {
    await page.goto('http://localhost:5173/card-of-the-day')

    await expect(page.locator('.instructions').nth(0)).toHaveText(
      'Click the top card deck to see your future.'
    )

    await page.evaluate(() => document.querySelector('#tarot-deck').click()) // a hackish way, using plain JS to work around an environment bug.

    await expect(page.locator('.instructions').nth(0)).toHaveText(
      'Pick one card'
    )
    await page.waitForTimeout(1000)

    await page.evaluate(() => {
      document.querySelector('.tarot-card').click() // a hackish way, using plain JS to work around an environment bug.
    })

    await page.waitForTimeout(1000)

    await expect(page.locator('.instructions').nth(0)).toHaveText('Click the selected card to reveal your day')

     await page.evaluate(() => {
       document.querySelector('.tarot-card').click() // a hackish way, using plain JS to work around an environment bug.
     })

    await page.click('.save-and-close-btn')

    await page.click('a[href="/history"]')

    await expect(page).toHaveURL('http://localhost:5173/history')

    await page.click('#card-of-the-day-section .question-history:first-child .toggle-wrapper')

    await page.waitForTimeout(1000)

    await page.click('#card-of-the-day-section .question-history:first-child .remove-btn')

  })

})
