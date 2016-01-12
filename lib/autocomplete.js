module.exports = autocomplete

var assert = require('assert')
var format = require('util').format

function autocomplete (uri, params, cb) {
  assert(typeof uri === 'string', 'must pass URI format string to autocomplete')
  assert(params && typeof params === 'object', 'must pass params to autocomplete')
  assert(typeof cb === 'function', 'must pass callback to autocomplete')

  assert(uri.indexOf('%s') !== -1, 'must have a %s in the autocomplete URI format string')
  assert(typeof params.word === 'string', 'must pass word to autocomplete')

  var word = params.word

  this.request(format(uri, word), {}, function (er, suggestions) {
    if (er) return cb(er)
    try {
      return cb(null, suggestions.sections.packages.map(function (suggestion) {
        return suggestion.value || suggestion
      }))
    } catch (er) {
      return cb(er)
    }
  })
}
