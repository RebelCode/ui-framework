// @flow

export default class Dom {
  document = {};
  constructor (document: Document) {
    if (typeof document === 'undefined') {
      throw new Error('The document object does not exist!')
    }
    this.document = document
  }
  getElements (selector: string) {
    const elements = this.document.querySelectorAll(selector)
    if (elements && elements.length > 0) {
      return [].slice.call(elements)
    }
    return []
  }
  getElement (selector: string) {
    return this.document.querySelector(selector)
  }
}
