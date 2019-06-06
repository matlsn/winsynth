# WinSynth

Simple and tiny (< 2kb) node module for synthesizing speech through `powershell` via SAPI.

**Warning: this module was made for a very specific project, and thus may be very limited for other use**

## Usage

```js
  // Example for speech synthesis that cuts itself off
  const synth = require('@mn6/winsynth')
  const events = require('events')
  const emitter = new events.EventEmitter()
  let speaking = null
  emitter.addListener('pid', pid => speaking = pid)

  const say = input => synth.say({
    'voice': 'Microsoft Zira Desktop',
    'rate': 1.2,
    'volume': 100,
    'cutoff': true,
    emitter,
    input,
    speaking
  })

  // Will cut off after 800ms
  say('This is an example message that should have already been cut off by another message.')
  setTimeout(() => say('This is a message that cut off the previous one!'), 800)
```
