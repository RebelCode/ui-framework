// @flow
import type { ContainerInterface } from '../container/ContainerInterface'

/**
 * Interface for Plugin class
 * @memberOf Core
 */
export interface PluginInterface {
  /**
   * Register plugin.
   *
   * Using register method plugin can change existing definitions and add
   * new definitions to application's services definitions.
   *
   * @param {Object.<string, Function>} services Services definitions map where key is a service name and
   *                                             function is a service factory function.
   *
   * @return {Object.<string, Function>} Updated services definitions.
   */
  register(services: {[string]: Function}): {[string]: Function};

  /**
   * Run the plugin.
   *
   * @param {ContainerInterface} container Ready container with all services.
   */
  run(container: ContainerInterface): void;
}
