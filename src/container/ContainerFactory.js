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

    for (const serviceName of Object.keys(definitions)) {
      const isClassConstructor = Reflection.isClass(definitions[serviceName])
      bottle.provider(serviceName, function () {
        /**
         * If service definition is a plain object, container
         * will return it on resolution.
         */
        if (!Reflection.isFunction(definitions[serviceName])) {
          this.$get = () => definitions[serviceName]
          return
        }

        const args = Reflection.getArguments(definitions[serviceName])

        /**
         * If service definition has no args or has one arg (_ref appears when spread is used),
         * treat the service as a factory function.
         */
        if (!isClassConstructor && (!args.length || args[0] === 'container' || args[0].indexOf('_ref') !== -1)) {
          this.$get = definitions[serviceName]
          return
        }

        if (!isClassConstructor) {
          this.$get = function (container) {
            let argsValues = args.reduce((values, arg) => {
              values.push(container[arg])
              return values
            }, [])
            return definitions[serviceName](...argsValues)
          }
          return
        }

        this.$get = function (container) {
          return definitions[serviceName]
        }
      })

      /**
       * Inject instance if this is a class constructor and is injectable.
       */
      const isInjectable = !!(definitions[serviceName].$inject || definitions[serviceName].$injectAs)
      if (isClassConstructor && isInjectable) {
        const lowercaseFirstLetter = (string) => {
          return string.charAt(0).toLowerCase() + string.slice(1)
        }

        const args = Reflection.getArguments(definitions[serviceName])
        const name = definitions[serviceName].$injectAs || lowercaseFirstLetter(serviceName)

        bottle.provider(name, function () {
          this.$get = function (container) {
            let argsValues = args.reduce((values, arg) => {
              values.push(container[arg])
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
