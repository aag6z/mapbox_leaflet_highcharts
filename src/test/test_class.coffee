# Description:
#   A very basic class for front-end test framework

'use strict'

class Test

  constructor: () ->
    # load configuration
    @config = require('./config.coffee')
    # load test client
    @client = require('./client.coffee').client
    # load assertion
    @expect = require('chai').expect

  ## define utils and helpers
  
  # make a generic HTTP (not HTTPS) request for JSON data
  getJson: (path, callback) ->
    http = require('http')
    http.get
      host: @config.domain
      path: path
    , (res) ->
      data = ''
      res.on 'data', (chunk) ->
        data += chunk
        return
      res.on 'end', ->
        json = JSON.parse(data)
        callback json[0]
        return
      return
    return # end getJson

module.exports = Test