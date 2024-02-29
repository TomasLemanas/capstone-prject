import { test, expect } from '@playwright/test'

test.describe('Three Card Deck Page', () => {
  test('should display instruction text, interact with the deck, submit a question, draw card, save the response and remove it', async ({
    page
  }) => {
    await page.goto('http://localhost:5173/three-card-deck')

    await expect(page.locator('.instructions').nth(0)).toHaveText(
      'Click the top card deck to draw your cards.'
    )

    await page.waitForSelector('.deck', { state: 'attached', timeout: 10000 })
    await page.evaluate(() => document.querySelector('.deck').click()) // a hackish way, using plain JS to work around an error.

    await page.waitForSelector('.question-modal', { state: 'visible' })

    await page.fill('textarea.question-text-area', 'What should I focus on today?')

    await page.click('button.submit-btn')

    await expect(page.locator('.instructions').nth(0)).toHaveText(
      'Select three cards to see your past, present, and future.'
    )

    await page.click('.nine-cards:nth-of-type(1)')

    await page.waitForTimeout(1000)

    await page.click('.nine-cards:nth-of-type(2)')

    await page.waitForTimeout(1000)

    await page.click('.nine-cards:nth-of-type(3)')

    await page.waitForTimeout(1000)

    await expect(page.locator('.instructions').nth(0)).toHaveText(
      'Press the button to reveal the meaning of your cards.'
    )

    await page.click('.reveal-card-meaning-btn')

    await page.waitForSelector('.meaning-modal-overlay', { state: 'visible' })

    await expect(page.locator('.card-meaning')).toHaveCount(3)

    await page.click('.save-and-close-three-card-deck-btn')

    await page.waitForSelector('.meaning-modal-overlay', { state: 'hidden' })

    await page.click('a[href="/history"]')

    await expect(page).toHaveURL('http://localhost:5173/history')

    await page.click('.question-history:nth-of-type(1) .toggle-wrapper')

    await page.waitForTimeout(1000)

    await page.click('.question-history:nth-of-type(1) .remove-btn')
  })
})
