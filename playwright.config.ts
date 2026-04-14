import { defineConfig, devices } from '@playwright/test'; 
export default defineConfig({ 
timeout: 30 * 1000,   //30000 ms(30 secs) 
 testDir: './tests', 
fullyParallel: false, 
retries:1, 
workers: 1, 
 reporter:[ 
    ['html'],    
    ['allure-playwright'],    
    ['dot'],   
    ['list']   
  ], 
  use: {
    baseURL: 'https://test-app.ewn.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure', 
    video: 'retain-on-failure', 
    viewport: { width: 1280, height: 720 }, // Set default viewport size for consistency
    ignoreHTTPSErrors: true, // Ignore SSL errors if necessary  
    permissions: ['geolocation'], // Set necessary permissions for geolocation-based tests
     },  

    projects: [
      {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
     },
     {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
     },
      ],
      }); 
