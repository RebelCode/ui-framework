/**
 * Implementation of WP-like hooks mechanism. It allows
 * to change any sort of data on demand.
 *
 * @class HookService
 *
 * @memberOf Services
 */
export default class HookService {
  /**
   * @constructor
   *
   * @since [*next-version*]
   */
  constructor () {
    this.hooks = {}
  }

  /**
   * Register hook.
   *
   * @since [*next-version*]
   *
   * @param {string} name The hook name.
   * @param {Function} callback Hook callback function.
   * @param {number} priority Priority for hook.
   */
  register (name, callback, priority = 10) {
    this.hooks[name] = this.hooks[name] ? this.hooks[name] : []
    this.hooks[name].push({callback, priority})
  }

  /**
   * Apply hooks.
   *
   * @since [*next-version*]
   *
   * @param {string} name The hook name.
   * @param {any} caller This context for callback function.
   * @param {any} data Data that should be modified by hooks sequence.
   * @param {any} context Context for hook function.
   */
  apply (name, caller, data, context) {
    let hooks = this.hooks[name] ? this.hooks[name] : []
    hooks = hooks.sort((a, b) => a.priority - b.priority)

    return hooks.reduce((data, { callback }) => {
      return callback.call(caller, data, context)
    }, data)
  }
}
