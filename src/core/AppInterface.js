// @flow
import Vue from 'vue'

export interface AppInterface {
  init(): {[string]: Array<Vue>};
  _registerVues(selectorList: Array<any>, components: {[string]: any}, methods: Object, data: Object): any;
  _handleElement(Root: Vue, components: {[string]: any}, item: any): any;
  _componentMixin(): Object;
}
