import { Status } from 'src/enums/Status.enum'

export interface ICampaign {
  id: string
  name: string
  status: Status
  menssageIds: string[]
}
