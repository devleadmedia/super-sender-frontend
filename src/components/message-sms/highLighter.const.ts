import { Extension } from '@tiptap/core'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { EditorState, Plugin } from 'prosemirror-state'
import { slugify } from 'src/utils/text.util'

interface INormalizedTerm {
  original: string
  normalized: string
  isMultiWord: boolean
}

interface IErrorHighlighterOptions {
  errorTerms: string[]
  errorClass: string
  normalizedTerms: INormalizedTerm[]
}

const GSM7 =
  '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà^{}\\[~]|€'.split(
    '',
  )

const GSM7_CHARS = new Set([...GSM7])

const VARIABLES = new Set(['{var1}', '{var2}', '{var3}', '{var4}', '{var5}'])

function createNormalizedTerms(errorTerms: string[]): INormalizedTerm[] {
  return errorTerms.map((term) => ({
    original: term,
    normalized: slugify(term),
    isMultiWord: term.trim().split(/\s+/).length > 1,
  }))
}

export const ErrorHighlighter = (errorTerms: string[]) =>
  Extension.create({
    name: 'errorHighlighter',
    addOptions() {
      return {
        errorTerms: errorTerms || [],
        errorClass: 'error-word',
        normalizedTerms: createNormalizedTerms(errorTerms),
      }
    },
    addProseMirrorPlugins() {
      return [createErrorHighlighterPlugin(this.options)]
    },
  })

function createErrorHighlighterPlugin(
  options: IErrorHighlighterOptions,
): Plugin {
  return new Plugin({
    props: {
      decorations: (editorState: EditorState) => {
        const { doc } = editorState

        const decorations: Decoration[] = []

        // if (options.errorTerms.length === 0) return DecorationSet.empty

        const multiWordTerms = options.normalizedTerms.filter(
          (t) => t.isMultiWord,
        )
        const singleWords = options.normalizedTerms.filter(
          (t) => !t.isMultiWord,
        )

        doc.descendants((node, pos) => {
          if (!node.isText) return

          const text = node.text!
          const normalizedText = slugify(text)

          handleMultiWordTerms(
            text,
            normalizedText,
            multiWordTerms,
            pos,
            options.errorClass,
            decorations,
          )

          handleSingleWords(
            text,
            singleWords,
            pos,
            options.errorClass,
            decorations,
          )

          handleNonGSM7Chars(text, pos, options.errorClass, decorations)

          handleVariables(text, pos, decorations)
        })

        return DecorationSet.create(doc, decorations)
      },
      handleDOMEvents: {
        // click: handleClickEvent,
      },
    },
  })
}

const handleVariables = (
  text: string,
  pos: number,
  decorations: Decoration[],
): void => {
  VARIABLES.forEach((variable) => {
    let index = 0
    while ((index = text.indexOf(variable, index)) !== -1) {
      const from = pos + index
      const to = from + variable.length

      console.log(`Highlighting variable: ${variable} at ${from}-${to}`)

      decorations.push(
        Decoration.inline(from, to, {
          class: 'variable-word',
          title: `A variável será substituida pela valor indicado`,
        }),
      )

      index += variable.length
    }
  })
}

function handleMultiWordTerms(
  text: string,
  normalizedText: string,
  terms: INormalizedTerm[],
  pos: number,
  errorClass: string,
  decorations: Decoration[],
): void {
  for (const term of terms) {
    let index = 0

    while ((index = normalizedText.indexOf(term.normalized, index)) !== -1) {
      const isWholeTerm =
        (index === 0 || !/\w/.test(normalizedText[index - 1]!)) &&
        (index + term.normalized.length === normalizedText.length ||
          !/\w/.test(normalizedText[index + term.normalized.length]!))

      if (isWholeTerm) {
        const from = pos + index
        const to =
          from + text.slice(index, index + term.normalized.length).length

        decorations.push(
          Decoration.inline(from, to, {
            class: errorClass,
            title: `O termo "${term.original}" está sujeito a shadow ban`,
          }),
        )
      }

      index += term.normalized.length
    }
  }
}

function handleSingleWords(
  text: string,
  terms: INormalizedTerm[],
  pos: number,
  errorClass: string,
  decorations: Decoration[],
): void {
  const wordRegex = /\b([\p{L}0-9_]+)\b/gu
  let match: RegExpExecArray | null

  while ((match = wordRegex.exec(text)) !== null) {
    const originalWord = match[0]
    const normalizedWord = slugify(originalWord)

    const term = terms.find((t) => t.normalized === normalizedWord)

    if (term) {
      const from = pos + match.index
      const to = from + originalWord.length

      decorations.push(
        Decoration.inline(from, to, {
          class: errorClass,
          title: `A palavra "${originalWord}" está sujeita a shadow ban`,
        }),
      )
    }
  }
}

function handleNonGSM7Chars(
  text: string,
  pos: number,
  errorClass: string,
  decorations: Decoration[],
): void {
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (char && !GSM7_CHARS.has(char)) {
      const from = pos + i
      const to = from + 1
      decorations.push(
        Decoration.inline(from, to, {
          class: `${errorClass} non-gsm7-char`,
          title: `Caractere "${char}" não está no padrão GSM7`,
        }),
      )
    }
  }
}

/* function handleClickEvent(_: EditorView, event: Event): void {
  const target = event.target as HTMLElement

  if (target.classList.contains('error-word')) {
    tippy(target, {
      content: target.innerText,
      trigger: 'manual',
    }).show()
  }
} */
