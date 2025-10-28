export const fileMaxSizeWhatsapp = {
  image: 5 * 1024 * 1024, // 5 MB
  video: 16 * 1024 * 1024, // 16 MB
  audio: 16 * 1024 * 1024, // 16 MB
  document: 100 * 1024 * 1024, // 100 MB
}

export const fileImageWhatsapp = ['image/jpeg', 'image/png']

export const fileVideoWhatsapp = ['video/3gpp', 'video/mp4']

export const fileAudioWhatsapp = [
  'audio/amr',
  'audio/mpeg',
  'audio/mp4',
  'audio/acc',
  'audio/ogg',
]

export const fileDocumentWhatsapp = [
  'text/plain',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]

export const filePermissionsWhatsapp = [
  ...fileImageWhatsapp,
  ...fileVideoWhatsapp,
  ...fileAudioWhatsapp,
  ...fileDocumentWhatsapp,
]

interface IFormMessageWhatsappDictory {
  [key: string]: string
}

export const fileDocumentWhatsappDictiory: IFormMessageWhatsappDictory = {
  'text/plain': 'TXT',
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'application/vnd.ms-powerpoint': 'PPT',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    'PPTX',
}
