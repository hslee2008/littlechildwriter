import { PlaywrightTestConfig, devices } from '@playwright/test'

const config: PlaywrightTestConfig = {
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 5 : 0,
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
    {
      name: 'webkit-mobile',
      use: {
        ...devices['iPhone X'],
      },
    },
    {
      name: 'webkit-mobile-2',
      use: {
        ...devices['iPhone 8'],
      },
    },
    {
      name: 'brave',
      use: {
        ...devices['Brave Browser'],
      },
    },
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
      },
    },
    {
      name: 'edge-mobile',
      use: {
        ...devices['iPhone X'],
      },
    },
    {
      name: 'edge-mobile-2',
      use: {
        ...devices['iPhone 8'],
      },
    },
    {
      name: 'samsung-galaxy-s10',
      use: {
        ...devices['Samsung Galaxy S10'],
      },
    },
  ],
}
export default config
