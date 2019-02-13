// @flow
import Container from './Container'
import type Bottle from 'bottlejs'
import Reflection from './../core/Reflection'

/**
 * Container factory for making bottle containers based on object containing services definitions.
 */
export default class ContainerFactory {
  Bottle: Bottle;

  /**
   * Create container factory.
   *
   * @param Bottle The bottle object constructor.
   */
  constructor (Bottle: Bottle) {
    this.Bottle = Bottle
  }

  /**
   * Create container that contains services.
   *
   * @param definitions The services definitions.
   *
   * @return {Container}
   */
  make (definitions: {[string]: Function}): Container {
    const bottle = new this.Bottle()

    const deepGet = (container, path, defaultValue) => {
      const pathParts = path.split('.')
      let lastMatch = defaultValue
      for (let pathPart of pathParts) {
        if (!container.hasOwnProperty(pathPart)) {
          return defaultValue
        }
        lastMatch = container[pathPart]
        if (!lastMatch) {
          return defaultValue
        }
      }
      return lastMatch
    }

    for (const serviceName of Object.keys(definitions)) {
      bottle.provider(serviceName, function () {
        /**
         * If service definition is not marked as $injectable,
         * treat it as a simple factory function.
         */
        if (!Reflection.isFunction(definitions[serviceName])) {
          this.$get = () => definitions[serviceName]
          return
        }
        if (!definitions[serviceName].$injectable) {
          this.$get = definitions[serviceName]
          return
        }

        const args = Object.keys(definitions[serviceName].$injectParams)

        this.$get = function (container) {
          let argsValues = args.reduce((values, argName) => {
            const path = definitions[serviceName].$injectParams[argName].from
            const defaultValue = definitions[serviceName].$injectParams[argName].default
            values.push(deepGet(container, path, defaultValue))
            return values
          }, [])
          return definitions[serviceName](...argsValues)
        }
      })

      /**
       * Inject instance if this is a class constructor and is injectable.
       */
      if (definitions[serviceName].$injectNewInstance) {
        const lowercaseFirstLetter = (string) => {
          return string.charAt(0).toLowerCase() + string.slice(1)
        }

        const args = Object.keys(definitions[serviceName].$injectParams)
        const name = definitions[serviceName].$injectAs || lowercaseFirstLetter(serviceName)

        bottle.provider(name, function () {
          this.$get = function (container) {
            let argsValues = args.reduce((values, argName) => {
              const path = definitions[serviceName].$injectParams[argName].from
              const defaultValue = definitions[serviceName].$injectParams[argName].default
              values.push(deepGet(container, path, defaultValue))
              return values
            }, [])
            return new definitions[serviceName](...argsValues)
          }
        })
      }
    }
    return new Container(bottle)
  }
}
