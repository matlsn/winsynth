const cp = require('child_process')
const defaults = {
  'rate': 1,
  'volume': 100,
  'voice': 'Microsoft Zira Desktop',
  'cutoff': true
}

/**
 * @param {Object|null} options Options for the export command. Object containing possible values of [ 'speaking': num, input': string, 'emitter': eventEmitter, 'rate': num (0-2), 'volume': num (0-100), 'voice': string, 'cutoff': bool ]
*/
const say = (options) => {
  if (!options.input) throw new Error('Input required for winsynth.say()!')
  Object.entries(defaults).forEach(d => { if (options[d[0]] === undefined) options[d[0]] = d[1] })
  if (!options.emitter && options.cutoff) throw new Error('Emitter required for winsynth.say() if cutoff option is true!')

  let command = 'Add-Type -AssemblyName System.speech;$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer;'
  if (options.speaking) cp.exec(`taskkill /pid ${options.speaking} /T /F`)
  return new Promise((resolve, reject) => {
    command += `$speak.SelectVoice('${options.voice}');$speak.Rate('${options.rate}');$speak.Volume('${options.volume}');$speak.Speak('${options.input}');`
    const pid = cp.spawn('powershell', [command], { 'shell': true })
    if (options.emitter && options.cutoff) options.emitter.emit('pid', pid.pid)
  })
}

module.exports = say
