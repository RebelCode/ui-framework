import App from './App'

export const UiFramework = {
  App,

  /**
   * List of UiFramework events.
   */
  events: {},

  /**
   * Emit event.
   *
   * @param eventName
   * @param payload
   */
  emit (eventName, payload) {
    if (!this.events[eventName]) {
      return
    }
    for (const callback of this.events[eventName]) {
      callback(payload)
    }
  },

  /**
   * Subscribe to event.
   *
   * @param eventName
   * @param callback
   */
  subscribe (eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback)
  }
}
