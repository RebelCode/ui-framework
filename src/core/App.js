// @flow

import {Dom} from '@/dom'
import { AppInterface } from '@/core/AppInterface'
import {ContainerInterface} from '@/container/ContainerInterface'
import {ExportCapableInterface} from '@/container/ExportCapableInterface'
import Vue from 'vue'

export default class App implements AppInterface {
  container = {};
  constructor (container: ContainerInterface & ExportCapableInterface) {
    this.container = container
  }
  _registerVues (selectorList: Array<string>, components: {[string]: any}) {
    const elements = {}
    const domDocument = this.container.get('document')
    const dom = new Dom.Dom(domDocument)
    const Vue = this.container.get('vue')
    let Root = Vue.extend()
    selectorList.map((el) => {
      elements[el] = dom.getElements(el).map(this._handleElement.bind(this, Root, components))
    })
    return elements
  }

  _handleElement (Root: Vue, components: {[string]: any}, item: any) {
    for (let key in components) {
      if (!(components.hasOwnProperty(key) && components[key].components)) {
        continue
      }
      const mixin = this._componentMixin()
      if (components[key].mixins && Array.isArray(components[key].mixins)) {
        components[key].mixins.push(mixin)
        continue
      }
      components[key].mixins = [mixin]
    }
    let instance = new Root({
      components: components,
      provide: this.container.export()
    })
    instance.$mount(item)
    return instance
  }

  _componentMixin () {
    return {
      created: function () {
        const components = this.$options.components
        for (let key in components) {
          if (!(components[key] && typeof components[key] === 'string')) {
            continue
          }
          debugger
          const inject = this[key]
          if (!inject) {
            throw new Error(`${[key]} not injected!`)
          }
          components[key] = inject
        }
      }
    }
  }

  init () {
    const sectorList = this.container.get('selectorList')
    const components = this.container.get('components')
    return this._registerVues(sectorList, components)
  }
}
