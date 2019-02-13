// @flow
/**
 * Interface for App class
 * @memberOf Core
 */
export interface AppInterface {
  init (selectorsMap: {[string]: string}): Promise<any>;
}
