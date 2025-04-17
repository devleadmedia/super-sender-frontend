import { shadowBanWords } from 'src/constants/sms/shadowBanWords.const'

export function smsInput(text: string) {
  return removeExactTerms(filterGSM7(text), listShadowBan)
}

function removeExactTerms(text: string, termsToRemove: string[]) {
  const normalizedTerms = termsToRemove.map((term) =>
    term
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase(),
  )

  const words = text.split(/(\s+)/)

  const result = words.map((word) => {
    if (word.trim() !== '') {
      const normalizedWord = word
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()

      const shouldRemove = normalizedTerms.some((term) =>
        normalizedWord.includes(term),
      )

      return shouldRemove ? '' : word
    }
    return word
  })
  return result.join('').replace(/\s+/g, ' ')
}

function filterGSM7(text: string) {
  return [...text]
    .filter((v) => {
      return allowedCharacters.has(v)
    })
    .join('')
}

const GSM7 =
  '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà^{}\\[~]|€'.split(
    '',
  )

const allowedCharacters = new Set([...GSM7])

const listShadowBan: string[] = []

shadowBanWords.forEach((item) =>
  item.data.forEach((data) => listShadowBan.push(data)),
)
