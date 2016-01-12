var test = require('tap').test

var server = require('./lib/server.js')
var common = require('./lib/common.js')
var client = common.freshClient()

function nop () {}

var URI = common.registry + '/?%s'
var WORD = 'reac'
var PARAMS = { word: WORD }

test('autocomplete call contract', function (t) {
  t.throws(function () {
    client.autocomplete(undefined, WORD, nop)
  }, 'requires a URI')

  t.throws(function () {
    client.autocomplete([], PARAMS, nop)
  }, 'requires URI to be a string')

  t.throws(function () {
    client.autocomplete('', PARAMS, nop)
  }, 'requires URI to be a format string')

  t.throws(function () {
    client.autocomplete(common.registry, PARAMS, nop)
  }, 'must have a %s in the autocomplete URI format string')

  t.throws(function () {
    client.autocomplete(URI, undefined, nop)
  }, 'requires params object')

  t.throws(function () {
    client.autocomplete(URI, '', nop)
  }, 'params must be object')

  t.throws(function () {
    client.autocomplete(URI, PARAMS, undefined)
  }, 'requires callback')

  t.throws(function () {
    client.autocomplete(URI, PARAMS, 'callback')
  }, 'callback must be function')

  t.throws(
    function () {
      var params = {}
      client.autocomplete(URI, params, nop)
    },
    { name: 'AssertionError', message: 'must pass word to autocomplete' },
    'must pass word to autocomplete'
  )

  t.end()
})

test('autocomplete', function (t) {
  server.expect('GET', '/?reac', function (req, res) {
    t.equal(req.method, 'GET')

    res.json({ sections: { packages: [{value: 'react'}, {value: 'request'}, {value: 'restify'}] } })
  })

  client.autocomplete(URI, PARAMS, function (error, suggestions) {
    t.ifError(error, 'no errors')
    t.same(['react', 'request', 'restify'], suggestions, 'get autocomplete values')

    server.close()
    t.end()
  })
})
