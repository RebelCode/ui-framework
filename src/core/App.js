// @flow

import {Dom} from '@/dom'
import { AppInterface } from '@/core/AppInterface'
import {ContainerInterface} from '@/container/ContainerInterface'
import {ExportCapableInterface} from '@/container/ExportCapableInterface'

export default class App implements AppInterface {
  container = {};
  constructor (container: ContainerInterface & ExportCapableInterface) {
    this.container = container
  }
  registerVues (selectorList: Array<string>, components: Array<any>) {
    const elements = {}
    const domDocument = this.container.get('document')
    const DOMManager = new Dom.Dom(domDocument)
    const Vue = this.container.get('vue')
    selectorList.map((el) => {
      if (!elements[el]) {
        elements[el] = []
      }
      DOMManager.getElements(el).map((item) => {
        elements[el].push(new Vue({
          components: components,
          provide: this.container.export()
        }).$mount(item))
      })
    })
    return elements
  }

  init () {
    const sectorList = this.container.get('selectorList')
    const components = this.container.get('components')
    return this.registerVues(sectorList, components)
  }
}
