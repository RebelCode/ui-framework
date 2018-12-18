import Container from './Container'

export default class ContainerFactory {
  constructor (Bottle) {
    this.Bottle = Bottle
  }

  make (definitions) {
    const bottle = new this.Bottle()
    for (const serviceName of Object.keys(definitions)) {
      bottle.factory(serviceName, definitions[serviceName])
    }
    return new Container(bottle)
  }
}
