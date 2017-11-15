// @flow
import Vue from 'vue'

export interface AppInterface {
  init(): {[string]: Array<Vue>};
  registerVues(selectorList: Array<any>, components: Array<any>, methods: Object, data: Object): any;
}
