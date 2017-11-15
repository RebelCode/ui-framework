// @flow
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import DOM from '@/utils/DOM'
import { AppInterface } from '@/core/AppInterface'
import {ContainerInterface} from '@/container/ContainerInterface'
import {ExportCapableInterface} from '@/container/ExportCapableInterface'

export default class AppContainer implements AppInterface {
  container = {};
  constructor (container: ContainerInterface & ExportCapableInterface) {
    this.container = container
  }
  registerVues (selectorList: Array<string>, components: Array<any>) {
    const elements = {}
    const DOMManager = new DOM()
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
