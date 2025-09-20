const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to test page
    await page.goto('http://localhost:8080/test.html');
    
    // Wait for tests to complete
    await page.waitForTimeout(3000);
    
    // Extract test results
    const results = await page.evaluate(() => {
      const summary = document.querySelector('.test-summary');
      if (!summary) return null;
      
      const passedMatch = summary.textContent.match(/Passed: (\d+)/);
      const failedMatch = summary.textContent.match(/Failed: (\d+)/);
      
      return {
        passed: passedMatch ? parseInt(passedMatch[1]) : 0,
        failed: failedMatch ? parseInt(failedMatch[1]) : 0,
        summary: summary.textContent
      };
    });
    
    console.log('Test Results:', results);
    
    if (results && results.failed > 0) {
      console.error('Some tests failed!');
      process.exit(1);
    }
    
    if (!results || results.passed === 0) {
      console.error('No tests passed - possible test runner issue');
      process.exit(1);
    }
    
    console.log('All tests passed successfully!');
    await browser.close();
  } catch (error) {
    console.error('Test runner error:', error);
    await browser.close();
    process.exit(1);
  }
})();