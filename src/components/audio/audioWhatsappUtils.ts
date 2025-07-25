function getFramesData(
  audioBuffer: AudioBuffer,
  channel: number,
  animation: boolean,
  animationframes: number,
): Float32Array[] {
  const rawData = audioBuffer.getChannelData(channel)

  const framesData = []
  if (animation) {
    const frames = audioBuffer.sampleRate / animationframes
    for (let index = 0; index < rawData.length; index += frames) {
      const partraw = rawData.slice(index, index + frames)
      framesData.push(partraw)
    }
  } else {
    framesData.push(rawData)
  }

  return framesData
}

function getFilterData(
  framesData: Float32Array[],
  samples: number,
): number[][] {
  const filteredData = []
  const framesDataLength = framesData.length
  for (let f = 0; f < framesDataLength; f++) {
    const blockSize = Math.floor(framesData[f]!.length / samples)
    const filteredDataBlock = []
    for (let i = 0; i < samples; i++) {
      const blockStart = blockSize * i
      let sum = 0
      for (let j = 0; j < blockSize; j++) {
        sum = sum + Math.abs(framesData[f]![blockStart + j]!)
      }
      filteredDataBlock.push(sum / blockSize)
    }
    filteredData.push(filteredDataBlock)
  }
  return filteredData
}

function getNormalizeData(filteredData: number[][]): number[][] {
  const multipliers = []
  const filteredDataLength = filteredData.length
  for (let i = 0; i < filteredDataLength; i++) {
    const multiplier = Math.max(...filteredData[i]!)
    multipliers.push(multiplier)
  }
  const maxMultiplier = Math.pow(Math.max(...multipliers), -1)

  const normalizeData = []
  for (let i = 0; i < filteredDataLength; i++) {
    const normalizeDataBlock = filteredData[i]!.map((n) => n * maxMultiplier)
    normalizeData.push(normalizeDataBlock)
  }
  return normalizeData
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function linearPath(audioBuffer: AudioBuffer, options: any): string {
  const {
    channel = 0,
    samples = audioBuffer.length,
    height = 100,
    width = 800,
    top = 0,
    left = 0,
    type = 'steps',
    paths = [{ d: 'Q', sx: 0, sy: 0, x: 50, y: 100, ex: 100, ey: 0 }],
    animation = false,
    animationframes = 10,
    normalize = true,
  } = options

  const framesData = getFramesData(
    audioBuffer,
    channel,
    animation,
    animationframes,
  )
  const filteredData = getFilterData(framesData, samples)
  const normalizeData = normalize
    ? getNormalizeData(filteredData)
    : filteredData

  let path = ``

  const fixHeight = type != 'bars' ? (height + top * 2) / 2 : height + top
  const fixWidth = width / samples
  const pathslength = paths.length
  const fixpathslength = type == 'mirror' ? pathslength * 2 : pathslength

  const normalizeDataLength = normalizeData.length

  for (let f = 0; f < normalizeDataLength; f++) {
    if (f > 0) {
      const pathlength = path.length
      const lastvalue = path.charAt(pathlength - 1)
      if (lastvalue == ';' || pathlength === 0) {
        path += ' M 0 0 ;'
      } else {
        path += ';'
      }
    }

    let last_pos_x = -9999
    let last_pos_y = -9999

    for (let i = 0; i < samples; i++) {
      const positive = type != 'bars' ? (i % 2 ? 1 : -1) : 1
      let mirror = 1
      for (let j = 0; j < fixpathslength; j++) {
        let k = j
        if (j >= pathslength) {
          k = j - pathslength
          mirror = -1
        }
        paths[k].minshow = paths[k].minshow ?? 0
        paths[k].maxshow = paths[k].maxshow ?? 1
        paths[k].normalize = paths[k].normalize ?? false
        const normalizeDataValue = paths[k].normalize ? 1 : normalizeData[f]![i]
        if (
          paths[k].minshow <= normalizeData[f]![i]! &&
          paths[k].maxshow >= normalizeData[f]![i]!
        ) {
          switch (paths[k].d) {
            case 'L': {
              const pos_x = i * fixWidth + (fixWidth * paths[k].sx) / 100 + left
              const pos_y =
                fixHeight +
                ((normalizeDataValue! * paths[k].sy) / 100) *
                  (type != 'bars' ? height / 2 : height) *
                  -positive *
                  mirror

              const end_pos_x =
                i * fixWidth + (fixWidth * paths[k].ex) / 100 + left
              const end_pos_y =
                fixHeight +
                ((normalizeDataValue! * paths[k].ey) / 100) *
                  (type != 'bars' ? height / 2 : height) *
                  -positive *
                  mirror

              if (pos_x !== last_pos_x || pos_y !== last_pos_y) {
                path += `M ${pos_x} ${pos_y} `
              }

              path += `L ${end_pos_x} ${end_pos_y} `

              last_pos_x = end_pos_x
              last_pos_y = end_pos_y
              break
            }

            case 'H': {
              const pos_x = i * fixWidth + (fixWidth * paths[k].sx) / 100 + left
              const pos_y =
                fixHeight +
                ((normalizeDataValue! * paths[k].y) / 100) *
                  (type != 'bars' ? height / 2 : height) *
                  -positive *
                  mirror

              const end_pos_x =
                i * fixWidth + (fixWidth * paths[k].ex) / 100 + left
              const end_pos_y = pos_y

              if (pos_x !== last_pos_x || pos_y !== last_pos_y) {
                path += `M ${pos_x} ${pos_y} `
              }

              path += `H ${end_pos_x} `

              last_pos_x = end_pos_x
              last_pos_y = end_pos_y
              break
            }

            case 'V': {
              const pos_x = i * fixWidth + (fixWidth * paths[k].x) / 100 + left
              const pos_y =
                fixHeight +
                ((normalizeDataValue! * paths[k].sy) / 100) *
                  (type != 'bars' ? height / 2 : height) *
                  -positive *
                  mirror

              const end_pos_x = pos_x
              const end_pos_y =
                fixHeight +
                ((normalizeDataValue! * paths[k].ey) / 100) *
                  (type != 'bars' ? height / 2 : height) *
                  -positive *
                  mirror

              if (pos_x !== last_pos_x || pos_y !== last_pos_y) {
                path += `M ${pos_x} ${pos_y} `
              }

              path += `V ${end_pos_y} `

              last_pos_x = end_pos_x
              last_pos_y = end_pos_y
              break
            }
 
            case 'C': {
              const pos_x = i * fixWidth + (fixWidth * paths[k].sx) / 100 + left
              const pos_y =
                fixHeight - ((fixHeight * paths[k].sy) / 100) * positive

              const center_pos_x =
                i * fixWidth + (fixWidth * paths[k].x) / 100 + left
              const center_pos_y =
                fixHeight +
                ((normalizeDataValue! * paths[k].y) / 100) *
                  (type != 'bars' ? height : height * 2) *
                  -positive *
                  mirror

              const end_pos_x =
                i * fixWidth + (fixWidth * paths[k].ex) / 100 + left
              const end_pos_y =
                fixHeight - ((fixHeight * paths[k].ey) / 100) * positive

              if (pos_x !== last_pos_x || pos_y !== last_pos_y) {
                path += `M ${pos_x} ${pos_y} `
              }

              path += `C ${pos_x} ${pos_y} ${center_pos_x} ${center_pos_y} ${end_pos_x} ${end_pos_y} `

              last_pos_x = end_pos_x
              last_pos_y = end_pos_y
              break
            }

            case 'Q': {
              const pos_x = i * fixWidth + (fixWidth * paths[k].sx) / 100 + left
              const pos_y =
                fixHeight +
                ((normalizeDataValue! * paths[k].sy) / 100) *
                  (type != 'bars' ? height / 2 : height) *
                  -positive *
                  mirror

              const center_pos_x =
                i * fixWidth + (fixWidth * paths[k].x) / 100 + left
              const center_pos_y =
                fixHeight +
                ((normalizeDataValue! * paths[k].y) / 100) *
                  (type != 'bars' ? height : height * 2) *
                  -positive *
                  mirror

              const end_pos_x =
                i * fixWidth + (fixWidth * paths[k].ex) / 100 + left
              const end_pos_y =
                fixHeight +
                ((normalizeDataValue! * paths[k].ey) / 100) *
                  (type != 'bars' ? height / 2 : height) *
                  -positive *
                  mirror

              if (pos_x !== last_pos_x || pos_y !== last_pos_y) {
                path += `M ${pos_x} ${pos_y} `
              }

              path += `Q ${center_pos_x} ${center_pos_y} ${end_pos_x} ${end_pos_y} `

              last_pos_x = end_pos_x
              last_pos_y = end_pos_y
              break
            }

            case 'A': {
              const pos_x = i * fixWidth + (fixWidth * paths[k].sx) / 100 + left
              const pos_y =
                fixHeight +
                ((normalizeDataValue! * paths[k].sy) / 100) *
                  (type != 'bars' ? height / 2 : height) *
                  -positive *
                  mirror

              const end_pos_x =
                i * fixWidth + (fixWidth * paths[k].ex) / 100 + left
              const end_pos_y =
                fixHeight +
                ((normalizeDataValue! * paths[k].ey) / 100) *
                  (type != 'bars' ? height / 2 : height) *
                  -positive *
                  mirror

              if (pos_x !== last_pos_x || pos_y !== last_pos_y) {
                path += `M ${pos_x} ${pos_y} `
              }
              const rx = (paths[k].rx * fixWidth) / 100
              const ry = (paths[k].ry * fixWidth) / 100
              let sweep = paths[k].sweep
              if (positive == -1) {
                if (sweep == 1) {
                  sweep = 0
                } else {
                  sweep = 1
                }
              }
              if (mirror == -1) {
                if (sweep == 1) {
                  sweep = 0
                } else {
                  sweep = 1
                }
              }
              path += `A ${rx} ${ry} ${paths[k].angle} ${paths[k].arc} ${sweep} ${end_pos_x} ${end_pos_y} `

              last_pos_x = end_pos_x
              last_pos_y = end_pos_y
              break
            }

            case 'Z':
              path += 'Z '
              break

            default:
              break
          }
        }
      }
    }
  }
  return path
}
