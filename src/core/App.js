// @flow
import {Dom} from '@/dom'
import {AppInterface} from './AppInterface'
import {ContainerInterface} from '@/container/ContainerInterface'
import {ExportCapableInterface} from '@/container/ExportCapableInterface'
import Vue from 'vue'

/**
 * Class for rendering Vues
 *
 * @memberOf Core
 */
export default class App implements AppInterface {
  container = {};

  /**
   * Insert DI container object
   * @param {object} container - DI container object
   */
  constructor (container: ContainerInterface & ExportCapableInterface) {
    this.container = container
  }

  /**
   * Mapping selectors
   * @param {array}  selectorList - list of selectors
   * @param {object} components   - components list
   * @returns {object} - list of instances
   * @private
   */
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

  /**
   * Handling element
   * @param {Vue} Root          - Vue.js object
   * @param {array}  components - Vue components
   * @param {*}      item       - DOM element
   * @returns {object} - instance
   * @private
   */
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

  /**
   * Mixin for components
   * @returns {{created: created}} - mixin for components
   * @private
   */
  _componentMixin () {
    return {
      created: function () {
        const components = this.$options.components
        for (let key in components) {
          if (!(components[key] && typeof components[key] === 'string')) {
            continue
          }
          const inject = this[key]
          if (!inject) {
            throw new Error(`${key} not injected!`)
          }
          components[key] = inject
        }
      }
    }
  }

  /**
   * The enter point for the application
   * @returns {{}}
   */
  init () {
    const sectorList = this.container.get('selectorList')
    const components = this.container.get('components')
    return this._registerVues(sectorList, components)
  }
}
