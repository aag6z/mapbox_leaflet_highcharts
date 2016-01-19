module.exports = (test) ->

  before (done) ->
    test.client.init().url 'https://' + test.config.domain, done
    return

  describe "Site #{test.config.domain}", ->
    it 'should be reachable', (done) ->
      test.client.getText 'title', (err, text) ->
        test.expect(text).not.to.be.null
        done()
        return
      return
    return
    
  after (done) ->
    test.client.end()
    done()
    return

  return