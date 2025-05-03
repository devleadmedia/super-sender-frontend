import { ShootingStatusSMS } from "src/enums/shot/ShootingStatusSMS.type"



export const shootingStatusSMSOptions = [
	{ name: 'Agendado', value: ShootingStatusSMS.scheduled },
	{ name: 'Cancelado', value: ShootingStatusSMS.canceled },
	{ name: 'Pausado', value: ShootingStatusSMS.paused },
	{ name: 'Executado', value: ShootingStatusSMS.executed },
	{ name: 'Processando', value: ShootingStatusSMS.processing },
	{ name: 'Erro', value: ShootingStatusSMS.error },
]

export const shootingStatusSMSDictionary = {
	[ShootingStatusSMS.scheduled]: {
		name: 'Agendado',
		color: 'blue'
	},
	[ShootingStatusSMS.canceled]: {
		name: 'Cancelado',
		color: 'gray'
	},
	[ShootingStatusSMS.paused]: {
		name: 'Pausado',
		color: 'purple'
	},
	[ShootingStatusSMS.executed]: {
		name: 'Executado',
		color: 'green'
	},
	[ShootingStatusSMS.processing]: {
		name: 'Processando',
		color: 'blue'
	},
	[ShootingStatusSMS.error]: {
		name: 'Erro',
		color: 'red'
	},
}
