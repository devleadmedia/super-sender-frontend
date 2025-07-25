<template>
  <div
    part="player"
    ref="player"
    class="player gap-sm relative q-pa-sm items-center"
  >
    <q-btn
      round
      unelevated
      @click="playPause"
      :icon="audio_paused ? 'play_arrow' : 'pause'"
      :loading="loading_audio_data"
    />

    <div id="slider" part="slider" ref="slider">
      <svg
        id="svg"
        part="svg"
        ref="svg"
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="'0 0 ' + waveWidth + ' ' + waveHeight"
        :width="waveWidth || 0"
        :height="waveHeight || 0"
      >
        <defs>
          <clipPath :id="clipPathX">
            <rect
              x="-1"
              y="-100"
              :width="(waveWidth || 0) + 2"
              :height="(waveHeight || 0) + 200"
            >
              <animate
                id="animationsvgx"
                ref="animationsvgx"
                attributeName="x"
                :values="'-1;' + ((waveWidth || 0) + 2)"
                :dur="animationsvgx_dur"
                fill="freeze"
              />
            </rect>
          </clipPath>
          <clipPath :id="clipPathA">
            <rect
              :x="-1 * ((waveWidth || 0) + 2)"
              y="-100"
              :width="(waveWidth || 0) + 2"
              :height="(waveHeight || 0) + 200"
            >
              >
              <animate
                id="animationsvg"
                ref="animationsvg"
                attributeName="x"
                :values="animationsvg_val"
                :dur="animationsvg_dur"
                fill="freeze"
              />
            </rect>
          </clipPath>
        </defs>
        <path
          id="path1"
          ref="path1"
          :stroke="noplayedLineColor ?? '#858a8d'"
          stroke-width="2"
          :d="path1_d || ''"
          :clip-path="'url(#' + clipPathX + ')'"
        ></path>
        <path
          id="path2"
          ref="path2"
          :stroke="playedLineColor ?? '#dadcdd'"
          stroke-width="2"
          :d="path2_d || ''"
          :clip-path="'url(#' + clipPathA + ')'"
          :style="{ display: path2_display }"
        ></path>
      </svg>

      <input
        ref="seekSlider"
        type="range"
        part="input"
        id="seek-slider"
        max="100"
        value="0"
        step="any"
        :style="{
          height: waveHeight + 'px',
        }"
        @input="sliderInput"
        @change="sliderChange"
      />

      <div id="current-time" part="currenttime" ref="currentTimeContainer">
        {{ currentTimeContainer_textContent }}
      </div>
    </div>

    <q-chip
      :title="'Velocidade: ' + playbackRate + 'x'"
      dense
      clickable
      color="grey"
      :label="`${playbackRate}x`"
      @click="toggleSpeed"
    />
  </div>

  <audio ref="audio" @ended="onFinish"></audio>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, watch, onUnmounted } from 'vue'
import { useAudioWhatsapp } from './useAudioWhatsapp'

interface IProps {
  waveWidth?: number
  waveHeight?: number
  src: string
  loadAudioOnmount?: boolean
  colorRead?: string
  colorUnRead?: string
  noplayedLineColor?: string
  playedLineColor?: string
}

const emit = defineEmits(['triedToSeek', 'onLoadedmetadata', 'onEnded'])
const props = defineProps<IProps>()

const {
  svg,
  audio,
  path1_d,
  path2_d,
  clipPathA,
  seekSlider,
  clipPathX,
  audioContext,
  audio_paused,
  playbackRate,
  path2_display,
  player_options,
  animationsvg_dur,
  animationsvgx_dur,
  animationsvg_val,
  loading_audio_data,
  currentTimeContainer_textContent,
  onFinish,
  playPause,
  clearMemory,
  sliderInput,
  toggleSpeed,
  runAudioPath,
  sliderChange,
} = useAudioWhatsapp(props.src, emit)

watch(playbackRate, (val) => {
  if (audio.value) audio.value.playbackRate = val
})

onBeforeMount(() => {
  player_options.width = props.waveWidth ?? 200
  player_options.height = props.waveHeight ?? 40

  audioContext.value = new window.AudioContext()
})

onMounted(async () => {
  svg.value?.pauseAnimations()
  animationsvg_val.value = '-' + (player_options.width + 2) + ';-1'

  if (props.loadAudioOnmount) await runAudioPath()
  if (audio.value) audio.value.playbackRate = playbackRate.value
})

onUnmounted(() => clearMemory())
</script>
<style lang="scss" scoped>
.player {
  display: flex;
}
#play {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0 0 0 10px;
  margin: 0px;

  svg {
    fill: #858a8d;
    position: relative;
    transition: transform 0.3s;
    top: -0.5px;
  }

  svg:hover {
    transform: scale(1.2);
  }

  svg path {
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: 0.2s;
  }
}

#svg {
  overflow: visible;
  stroke-width: 1px;
  fill: none;
}

#path1 {
  // stroke: #dadcdd;
  overflow: visible;
  stroke-linecap: round;
}

#path2 {
  // stroke: #858a8d;
  overflow: visible;
  stroke-linecap: round;
}

#slider {
  position: relative;
  display: flex;
  height: 100%;
}

#current-time {
  color: #858a8d;
  font-size: 11px;
  position: absolute;
  left: 0;
  bottom: -20px;
}

#seek-slider {
  position: absolute;
  width: 100%;
  left: 0;
}

input[type='range'] {
  -webkit-appearance: none;
  width: 100%;
  background: transparent;
  padding: 0px;
  margin: 0px;
  border: 0px;
}
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
}
input[type='range']:focus {
  outline: none;
}

input[type='range']::-ms-track {
  width: 100%;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  position: relative;
  height: 12.5px;
  width: 12.5px;
  border-radius: 50%;
  background: #4fc3f7;
  cursor: pointer;
  box-shadow: none;
}
input[type='range']::-webkit-slider-thumb {
  transition: transform 0.3s;
}
input[type='range']:active::-webkit-slider-thumb {
  transform: scale(1.5);
}
input[type='range']::-moz-range-thumb {
  height: 12.5px;
  width: 12.5px;
  border-radius: 50%;
  background: #4fc3f7;
  cursor: pointer;
  box-shadow: none;
  border: 0px;
}

input[type='range']:active::-moz-range-thumb {
  transform: scale(1.5);
}
</style>
