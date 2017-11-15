// @flow
import bottle from '../test/temp/services/'
import AppContainer from '@/core/App'
import Container from '@/container/Container'

export default class App {
  init (bottle) {
    const container = new Container(bottle)
    return new AppContainer(container).init()
  }
  getDefaultBottle () {
    return Object.assign(Object.create(bottle), bottle) // clone
  }
}
