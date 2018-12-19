// @flow

type Hook = {
  callback: Function,
  priority: number
}

/**
 * Implementation of WP-like hooks mechanism. It allows
 * to change any sort of data on demand.
 *
 * @class HookService
 *
 * @memberOf Services
 */
export default class HookService {
  hooks: {[string]: Array<Hook>};

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
   * @param name The hook name.
   * @param callback Hook callback function.
   * @param priority Priority for hook.
   */
  register (name: string, callback: Function, priority: number = 10) {
    this.hooks[name] = this.hooks[name] ? this.hooks[name] : []
    this.hooks[name].push({callback, priority})
  }

  /**
   * Apply hooks.
   *
   * @since [*next-version*]
   *
   * @param name The hook name.
   * @param caller This context for callback function.
   * @param data Data that should be modified by hooks sequence.
   * @param context Context for hook function.
   */
  apply (name: string, caller: Function, data: any, context: any = {}) {
    let hooks = this.hooks[name] ? this.hooks[name] : []
    hooks = hooks.sort((a, b) => a.priority - b.priority)

    return hooks.reduce((data, { callback }) => {
      return callback.call(caller, data, context)
    }, data)
  }
}
