
var fs = require('fs')
  , path = require('path')
  , PassThrough = require('readable-stream').PassThrough
  , xtend = require('xtend')
  , defaults = {
        dir: path.join(path.dirname(require.main.filename), 'doc')
      , ext: '.txt'
    }
  , pump = require('pump')


function helpMe(opts) {

  opts = xtend(defaults, opts)

  if (!opts.dir) {
    throw new Error('missing directory')
  }

  return {
    createHelpStream: createHelpStream
  }

  function toPath(name) {
    return path.join(opts.dir, name + opts.ext)
  }

  function createHelpStream(args) {
    var out         = new PassThrough()
    var toStream    = toPath('help')

    if (typeof args === 'string') {
      toStream = toPath(args)
    } else if (args && args.length > 0) {
      toStream = toPath(args[0])
    }

    return fs.createReadStream(toStream)
      .on('error', function(err) {
        out.emit('error', err)
      })
      .pipe(out)
  }
}

module.exports = helpMe
