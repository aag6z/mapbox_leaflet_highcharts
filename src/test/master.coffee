## --------------------------------------------------
#  Main test script to be executed
## --------------------------------------------------

'use strict'

Test = require('./test_class.coffee')
test = new Test

describe 'Ping: ', -> require('./ping_test.coffee')(test)