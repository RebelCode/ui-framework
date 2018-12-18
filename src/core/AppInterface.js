// @flow
/**
 * Interface for App class
 * @memberOf Core
 */
export interface AppInterface {
  init (selectorsList: Array<string>): Promise<any>;
}
