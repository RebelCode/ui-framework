// @flow

import {ContainerInterface} from '@/container/ContainerInterface'
import {ExportCapableInterface} from '@/container/ExportCapableInterface'

export default class Container implements ContainerInterface, ExportCapableInterface {
  bottle = {};
  container = {};
  constructor (bottle: Object) {
    this.bottle = bottle
    this.container = bottle.container
  }
  get (key: string) {
    const service = this.container[key]
    if (!service) {
      throw new Error(`${key} service does not exists!`)
    }
    return service
  }
  export () {
    return this.container
  }
}
