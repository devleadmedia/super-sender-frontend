import { boot } from 'quasar/wrappers'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $vInput: object
    $vSelect: object
    $vTable: object
    $vCard: object
    $vMenu: object
    $vBanner: object
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$vCard = {
    bordered: true,
    class: "shadow-0"
  }
  app.config.globalProperties.$vTable = {
    bordered: true,
    class: "shadow-0"
  }
  app.config.globalProperties.$vInput = {
    dense: true,
    outlined: true,
  }
  app.config.globalProperties.$vSelect = {
    emitValue: true,
    mapOptions: true,
    dense: true,
    outlined: true,
    optionValue: 'value',
    optionLabel: 'name',
  }
})
