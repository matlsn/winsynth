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
const say = options => {
  if (!options.input) throw new Error('Input required for winsynth.say()!')
  Object.entries(defaults).forEach(d => { if (options[d[0]] === undefined) options[d[0]] = d[1] })
  if (!options.emitter && options.cutoff) throw new Error('Emitter required for winsynth.say() if cutoff option is true!')
  if (typeof options.rate !== 'number' || ((options.rate < 0) || (options.rate > 2))) throw new Error('Rate must be a number between 0-2!')
  if (typeof options.volume !== 'number' || ((options.volume < 0) || (options.volume > 100))) throw new Error('Volume must be a number between 0-100!')
  if (typeof options.voice !== 'string' || (!['Microsoft Zira Desktop', 'Microsoft David Desktop'].includes(options.voice))) throw new Error('Voice must be a valid SAPI voice! [Microsoft Zira Desktop, Microsoft David Desktop]')
  if (typeof options.cutoff !== 'boolean') throw new Error('Cutoff must be a boolean!')

  let command = 'Add-Type -AssemblyName System.speech;$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer;'
  if (options.speaking) cp.exec(`taskkill /pid ${options.speaking} /T /F`)
  return new Promise((resolve, reject) => {
    command += `$speak.SelectVoice('${options.voice}');$speak.Rate('${options.rate}');$speak.Volume('${options.volume}');$speak.Speak([Console]::In.ReadToEnd());`
    
    const process = cp.spawn('powershell', [command], { 'shell': true })
    process.stdin.setEncoding('ascii')
    process.stderr.setEncoding('ascii')
    process.stdin.end(options.input)

    if (options.emitter && options.cutoff) options.emitter.emit('pid', process.pid)
  })
}

module.exports = say
