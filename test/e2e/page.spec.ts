import { test, expect } from '@playwright/test'

test('Index Page Testing [Header]', async ({ page, baseURL }) => {
  await page.goto('http://localhost:3000/')

  const title = page.locator('h1')
  await expect(title).toHaveText('Little 작가')
})

test('Post Page Testing [Go To Page]', async ({ page, baseURL }) => {
  await page.goto('http://localhost:3000/')

  await page.locator('button').first().click()
})
