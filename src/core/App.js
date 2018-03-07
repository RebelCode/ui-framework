// @flow
import {Dom} from '@/dom'
import {AppInterface} from './AppInterface'
import {ContainerInterface} from '@/container/ContainerInterface'
import {ExportCapableInterface} from '@/container/ExportCapableInterface'
import type Vue from 'vue-flow-definitions/definitions/vue_v2.x.x/vue_v2.x.x'

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
    const Vue = this.container.get('vue')
    if (!Vue.isInjectedComponentsInstalled) {
      throw new Error('Injected Components plugin must be installed for UI Framework application')
    }
    const elements = {}
    const domDocument = this.container.get('document')
    const dom = new Dom.Dom(domDocument)
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
    let instance = new Root({
      components: components,
      provide: this.container.export()
    })
    instance.$mount(item)
    return instance
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
