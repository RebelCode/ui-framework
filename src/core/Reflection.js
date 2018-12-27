export default class Reflection {
  static getArguments (func) {
    if (!this.isFunction(func)) {
      return false
    }

    let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
    let ARGUMENT_NAMES = /([^\s,]+)/g

    const fnStr = func.toString().replace(STRIP_COMMENTS, '')
    let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)
    if (result === null) {
      result = []
    }
    return result
  }

  static isFunction (functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  }

  static isClass (v) {
    if (typeof v !== 'function') {
      return false
    }
    try {
      v()
      return false
    } catch (error) {
      console.warn(error.message)
      return /constructor/.test(error.message) || /class as/.test(error.message)
    }
  }

  static log (obj) {
    const args = Reflection.getArguments(obj)
    console.info({
      'typeof': typeof obj,
      args,
      str: obj.toString(),
      isClass: Reflection.isClass(obj)
    })
  }

  static isAnonymous (func) {
    const match = func.toString().match(/^function ([^\s]+) \(\)/)
    return !match || !match[1]
  }
}
