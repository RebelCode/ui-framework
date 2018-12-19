// @flow
import Container from './Container'
import type Bottle from 'bottlejs'

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
      bottle.factory(serviceName, definitions[serviceName])
    }
    return new Container(bottle)
  }
}
