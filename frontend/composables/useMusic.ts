const CHORDS = [
  { freqs: [261.63, 329.63, 392.00, 493.88], bass: 130.81 },  // Cmaj7
  { freqs: [220.00, 261.63, 329.63, 392.00], bass: 110.00 },  // Am7
  { freqs: [293.66, 349.23, 440.00, 523.25], bass: 146.83 },  // Dm7
  { freqs: [196.00, 246.94, 349.23, 392.00], bass: 98.00 },   // G7
]

const BPM = 70
const BEAT = 60 / BPM

export const useMusic = () => {
  const isPlaying = ref(false)
  let ctx: AudioContext | null = null
  let masterGain: GainNode | null = null
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let chordIdx = 0

  function stopChord(notes: OscillatorNode[], gains: GainNode[]) {
    notes.forEach((o, i) => {
      gains[i].gain.setTargetAtTime(0, ctx!.currentTime, 0.4)
      o.stop(ctx!.currentTime + 1.2)
    })
  }

  function playChord() {
    if (!ctx || !masterGain) return
    const now = ctx.currentTime
    const chord = CHORDS[chordIdx]
    chordIdx = (chordIdx + 1) % CHORDS.length

    const notes: OscillatorNode[] = []
    const gains: GainNode[] = []

    chord.freqs.forEach((freq, i) => {
      const osc = ctx!.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq

      const gain = ctx!.createGain()
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.03, now + 0.3 + i * 0.06)

      const filter = ctx!.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 700 + i * 250
      filter.Q.value = 0.5

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(masterGain!)
      osc.start(now)
      notes.push(osc)
      gains.push(gain)
    })

    const bass = ctx!.createOscillator()
    bass.type = 'sine'
    bass.frequency.value = chord.bass
    const bassGain = ctx!.createGain()
    bassGain.gain.setValueAtTime(0, now)
    bassGain.gain.linearRampToValueAtTime(0.04, now + 0.15)
    bass.connect(bassGain)
    bassGain.connect(masterGain!)
    bass.start(now)
    notes.push(bass)
    gains.push(bassGain)

    const chordDuration = BEAT * 4
    const fadeStart = chordDuration - 0.5
    setTimeout(() => {
      stopChord(notes, gains)
    }, fadeStart * 1000)

    timeoutId = setTimeout(playChord, chordDuration * 1000)
  }

  function start() {
    ctx = new AudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    masterGain = ctx!.createGain()
    masterGain.gain.value = 0.05
    masterGain.connect(ctx!.destination)

    chordIdx = 0
    playChord()
    isPlaying.value = true
  }

  function stop() {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    ctx?.close()
    ctx = null
    masterGain = null
    isPlaying.value = false
  }

  function toggle() {
    if (isPlaying.value) stop()
    else start()
  }

  onUnmounted(() => stop())

  return { isPlaying, toggle }
}
