export default {
  install (Vue, {container}) {
    /*
     * Add flag that indicate that plugin is installed and
     * components can be injected
     */
    Vue.isInjectedComponentsInstalled = true

    /*
     * Register Vue mixin that resolve string component
     * definition and replace it with injected component definition
     * from the store.
     */
    Vue.mixin({
      created () {
        const components = this.$options.components
        for (let key in components) {
          if (!components[key] || typeof components[key] !== 'string') {
            continue
          }
          const inject = container[key]
          if (!inject) {
            throw new Error(`${key} service is not defined!`)
          }
          components[key] = inject
        }
      }
    })
  }
}
