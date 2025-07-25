import { reactive, ref } from 'vue'
import { linearPath } from './audioWhatsappUtils'
import requester from 'src/helpers/requester/Requester.helper'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAudioWhatsapp(source: string, emit: any) {
  const animation = ref<boolean>(false)
  const player_options = reactive({
    samples: 40,
    type: 'mirror',
    width: 200,
    height: 40,
    paths: [{ d: 'V', sy: 0, x: 50, ey: 100 }],
    channel: 0,
    top: 0,
    left: 0,
    animation: false,
    animationframes: 10,
    normalize: true,
  })

  const svg = ref<SVGSVGElement | null>(null)
  const path1 = ref<SVGPathElement | null>(null)
  const path2 = ref<SVGPathElement | null>(null)
  const animationsvg = ref<SVGAnimateElement | null>(null)
  const animationsvgx = ref<SVGAnimateElement | null>(null)
  const audio = ref<HTMLAudioElement | null>(null)
  const seekSlider = ref<HTMLInputElement | null>(null)
  const currentTimeContainer = ref<HTMLElement | null>(null)
  const raf = ref<number | null>(null)
  const audioData = ref<AudioBuffer | null>(null)

  const currentTimeContainer_textContent = ref<string>('0:00')
  const animationsvg_dur = ref<string>('999s')
  const animationsvgx_dur = ref<string>('999s')
  const audio_paused = ref<boolean>(true)
  const path2_display = ref<string>('block')
  const path1_d = ref<string | null>(null)
  const path2_d = ref<string | null>(null)
  const animationsvg_val = ref<string>('')

  const clipPathX = ref<string>(
    'left-to-right-x-' + Math.random().toString(36).slice(2),
  )
  const clipPathA = ref<string>(
    'left-to-right-' + Math.random().toString(36).slice(2),
  )
  const audioContext = ref<AudioContext | null>(null)
  const loading_audio_data = ref<boolean>(false)
  const loaded_audio_data = ref<boolean>(false)

  const speedOptions = [1, 1.5, 2]
  const playbackRate = ref<number>(1)

  function toggleSpeed() {
    const idx = speedOptions.indexOf(playbackRate.value)
    const nextIdx = (idx + 1) % speedOptions.length
    playbackRate.value = speedOptions[nextIdx]!
    if (audio.value) {
      audio.value.playbackRate = playbackRate.value
    }
  }

  function calculateTime(secs: number): string {
    const minutes = Math.floor(secs / 60)
    const seconds = Math.floor(secs % 60)
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
    return `${minutes}:${returnedSeconds}`
  }

  function loadSong($event?: Event) {
    if (!audio.value) return
    if (seekSlider.value) seekSlider.value.max = String(audio.value.duration)
    svg.value?.unpauseAnimations()
    animationsvg_dur.value = audio.value.duration + 's'
    if (!animation.value) {
      animationsvgx_dur.value = audio.value.duration + 's'
    }
    svg.value?.pauseAnimations()
    svg.value?.setCurrentTime(0)
    if ($event) emit('onLoadedmetadata', $event)
  }

  async function playPause() {
    if (!loaded_audio_data.value) return runAudioPath()

    if (audio.value && audio.value.paused) {
      await audio.value.play()
      svg.value?.unpauseAnimations()
      if (path2.value) path2.value.style.display = 'block'
      audio_paused.value = false
      raf.value = requestAnimationFrame(whilePlaying)
    } else if (audio.value) {
      audio.value.pause()
      svg.value?.pauseAnimations()
      audio_paused.value = true
      if (raf.value) cancelAnimationFrame(raf.value)
    }
  }

  function sliderInput() {
    path2_display.value = 'block'
    if (seekSlider.value) {
      currentTimeContainer_textContent.value = calculateTime(
        Number(seekSlider.value.value),
      )
      svg.value?.setCurrentTime(Number(seekSlider.value.value))
      if (audio.value && !audio.value.paused && raf.value) {
        cancelAnimationFrame(raf.value)
      }
    }
  }

  function sliderChange() {
    emit('triedToSeek', true)
    if (audio.value && seekSlider.value) {
      audio.value.currentTime = Number(seekSlider.value.value)
      path2_display.value = 'block'
      svg.value?.setCurrentTime(Number(seekSlider.value.value))
      if (!audio.value.paused) {
        raf.value = requestAnimationFrame(whilePlaying)
      }
    }
  }

  function onFinish($event: Event) {
    if (seekSlider.value && audio.value) {
      seekSlider.value.value = String(seekSlider.value.max)
      svg.value?.setCurrentTime(audio.value.duration)
      svg.value?.pauseAnimations()
      audio_paused.value = true
      if (raf.value) cancelAnimationFrame(raf.value)
      emit('onEnded', $event)
    }
  }

  function whilePlaying() {
    if (audio.value && seekSlider.value) {
      seekSlider.value.value = String(audio.value.currentTime)
      currentTimeContainer_textContent.value = calculateTime(
        audio.value.currentTime,
      )
      svg.value?.setCurrentTime(audio.value.currentTime)
      raf.value = requestAnimationFrame(whilePlaying)
    }
  }

  async function runAudioPath() {
    await getAudioData(source)
  }

  function svgDraw() {
    if (!audioData.value) return
    const path = linearPath(audioData.value, player_options)
    path1_d.value = path
    path2_d.value = path
    svg.value?.setCurrentTime(
      seekSlider.value ? Number(seekSlider.value.value) : 0,
    )
  }

  function clearMemory() {
    if (audio.value?.src) URL.revokeObjectURL(audio.value.src)
  }

  async function getAudioData(url: string): Promise<void> {
    loading_audio_data.value = true

    await requester.dispatch({
      callback: async () => {
        const response = await fetch(url)
        const blob = await response.blob()

        const fileReader = new FileReader()

        audio.value!.src = URL.createObjectURL(blob)

        fileReader.onloadend = async () => {
          await audioContext.value!.decodeAudioData(
            fileReader.result as ArrayBuffer,
            (bufferData) => {
              audioData.value = bufferData
              setTimeout(() => {
                loading_audio_data.value = false
                loaded_audio_data.value = true
                loadSong()
                svgDraw()
              }, 1000)
            },
            (err) => {
              loading_audio_data.value = false
              console.error(err)
              throw new Error('Erro ao decodificar audio')
            },
          )
        }

        fileReader.readAsArrayBuffer(blob)
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possivel reproduzir o áudio',
    })
  }

  return {
    raf,
    svg,
    path1,
    path2,
    audio,
    seekSlider,
    audio_paused,
    path1_d,
    path2_d,
    animationsvg_dur,
    animationsvgx_dur,
    currentTimeContainer_textContent,
    path2_display,
    clipPathX,
    clipPathA,
    audioData,
    animationsvg,
    animationsvgx,
    audioContext,
    playbackRate,
    player_options,
    animationsvg_val,
    loading_audio_data,
    currentTimeContainer,
    onFinish,
    playPause,
    sliderInput,
    clearMemory,
    toggleSpeed,
    sliderChange,
    runAudioPath,
  }
}
