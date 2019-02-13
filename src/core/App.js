// @flow
import {Dom} from '@/dom'
import { AppInterface } from './AppInterface'
import type Vue from 'vue-flow-definitions/definitions/vue_v2.x.x/vue_v2.x.x'
import ContainerFactory from '../container/ContainerFactory'
import type { PluginInterface } from './PluginInterface'
import type { ContainerInterface } from '../container/ContainerInterface'
import type { ExportCapableInterface } from '../container/ExportCapableInterface'

/**
 * Represents an application that uses the UI framework approach.
 *
 * This application achieves the following:
 * - Automatic creation and configuration of root Vue instances for all selected elements.
 * - Standard set of components for every such instance.
 * - Standard set of services for all Vue root instances and their child compoenents
 * usable with `inject`.
 * - Ability to inject components into child components automatically, making all
 * components usable recursively.
 *
 * This means a single, uniform, automated approach to management of application parts
 * which are distributed in different areas of the page, with a single set of components
 * and other services for all areas.
 *
 * @memberOf Core
 */
export default class App implements AppInterface {
  /**
   * @property services The map of services definitions where key is a string, and value is a service factory function.
   */
  services: {[string]: Function};

  /**
   * @property containerFactory Container factory.
   */
  containerFactory: ContainerFactory;

  /**
   * @property container Main application container.
   */
  container: ContainerInterface & ExportCapableInterface;

  /**
   * @property plugins The list of plugins for the application.
   */
  plugins: Array<string>;

  /**
   * Application constructor.
   *
   * @param {ContainerFactory} containerFactory
   * @param services
   */
  constructor (containerFactory: ContainerFactory, services: { [string]: Function }) {
    this.containerFactory = containerFactory
    this.services = services
    this.plugins = []
  }

  /**
   * @param {string[]} plugins List of plugins names.
   */
  use (plugins: Array<string> = []) {
    this.plugins = plugins
  }

  /**
   * The enter point for the application.
   *
   * @param {array} selectorsMap  A map of selectors for HTML elements where key is selector and value is the app service key.
   *
   * @return {Promise<{[string]: Array<Vue>}>}  The registered Vue instances.
   *                              A map, where the key is a selector, and the value is a list of Vue instances.
   */
  init (selectorsMap: {[string]: string}): Promise<any> {
    return this._loadPlugins()
      .then((plugins) => {
        this._runApplication(selectorsMap, plugins)
      })
  }

  /**
   * Wait for all plugins are loaded.
   *
   * @return {Promise<{[string]: Array<Vue>}>}
   */
  _loadPlugins (): Promise<any> {
    return new Promise((resolve) => {
      if (this._allPluginsLoaded(this.plugins)) {
        resolve(this._getLoadedPlugins(this.plugins))
      } else {
        window.UiFramework.subscribe('plugin-loaded', () => {
          if (this._allPluginsLoaded(this.plugins)) {
            resolve(this._getLoadedPlugins(this.plugins))
          }
        })
      }
    })
  }

  /**
   * Prepare container and run the application.
   *
   * @param {array} selectorsMap  A map of selectors for HTML elements where key is selector and value is the app service key.
   * @param plugins
   */
  _runApplication (selectorsMap: {[string]: string}, plugins: Array<PluginInterface>) {
    this.services = plugins
      .reduce((services, plugin) => {
        services = plugin.register(services)
        return services
      }, this.services)
    this.container = this.containerFactory.make(this.services)
    plugins.forEach(plugin => plugin.run(this.container))

    return this._registerVues(selectorsMap)
  }

  /**
   * Check whether all plugins are loaded.
   *
   * @param pluginsKeys
   *
   * @return {boolean}
   */
  _allPluginsLoaded (pluginsKeys: Array<string>): boolean {
    return pluginsKeys.reduce((result, pluginName) => {
      return result && !!window.UiFramework.plugins[pluginName]
    }, true)
  }

  /**
   * Get list of loaded plugins.
   *
   * @param pluginsKeys
   *
   * @return {PluginInterface[]}
   */
  _getLoadedPlugins (pluginsKeys: Array<string>): Array<PluginInterface> {
    return pluginsKeys
      .map(pluginName => window.UiFramework.plugins[pluginName])
      .filter(plugin => !!plugin)
      .sort((a, b) => a.priority - b.piority)
      .map(a => a.plugin)
  }

  /**
   * Create and register a root Vue instance for every DOM element that matches every selector in the list.
   *
   * The result will be a multitude of Vue instances for all elements identified by selectors in the given selector list.
   * Each such instance will have local access to all components from the given component list.
   *
   * @param {array} selectorsMap  A map of selectors for HTML elements where key is selector and value is the app service key.
   *
   * @returns {[string]: array}   The registered Vue instances.
   *                              A map, where the key is a selector, and the value is a list of Vue instances.
   * @private
   */
  _registerVues (selectorsMap: {[string]: string}) {
    const Vue = this.container.get('vue')
    if (!Vue.isInjectedComponentsInstalled) {
      throw new Error('Injected Components plugin must be installed for UI Framework application')
    }
    const elements = {}
    const domDocument = this.container.get('document')
    const dom = new Dom.Dom(domDocument)
    let Root = Vue.extend()
    Object.keys(selectorsMap).map((el) => {
      elements[el] = dom.getElements(el).map(this._handleElement.bind(this, Root, selectorsMap[el]))
    })
    return elements
  }

  /**
   * Creates and configures a Vue instance for a DOM element.
   *
   * Makes sure that all components from the component list are available to that instance,
   * and that each component is set up, if this has not been done already.
   * Root Vue instances will provide standard services to their children.
   * Components may have standard mixins added.
   *
   * @param {Vue} Root          Vue constructor.
   * @param {string} appComponentKey  Vue component definitions.
   * @param {*} item            DOM element
   *
   * @returns {object}          The new Vue instance, configured for the DOM element.
   *
   * @private
   */
  _handleElement (Root: Vue, appComponentKey: string, item: any) {
    let instance = new Root({
      components: {
        [appComponentKey]: this.container.get(appComponentKey)
      },
      provide: this.container.export()
    })
    instance.$mount(item)
    return instance
  }
}
