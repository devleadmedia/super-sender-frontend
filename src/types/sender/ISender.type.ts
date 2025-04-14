import type { Status } from "src/enums/Status.enum"


export interface ISender {
  id: string
  operator: string
  ddd: string
  number: string
  status: Status
}

