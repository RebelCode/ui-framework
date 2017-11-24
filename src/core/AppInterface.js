// @flow
import Vue from 'vue'

/**
 * Interface for App class
 * @memberOf Core
 */
export interface AppInterface {
  init(): {[string]: Array<Vue>};
}
