exports.client = require 'webdriverio'
  .remote
    desiredCapabilities:
      # 'phtantomJS' has issues connecting via https.  Until we workaround this issue, I have us using Firefox.  
      # ChromeDriver requires a separate download, so I am sparing people the trouble of downloading.
      # Focus should be on fixing the phantomJS driver
      browserName: 'phantomjs'
    logLevel: 'debug'
