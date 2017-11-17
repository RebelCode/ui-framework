// @flow

import {FormatTranslatorInterface} from './FormatTranslatorInterface'

export default class FormatTranslator implements FormatTranslatorInterface {
  formatter: Function;
  constructor (formatter: (format: string, params: ?Array<mixed>) => string) {
    this.formatter = formatter
  }
  translate (format: string, params: ?Array<mixed>, context: ?string) {
    return this.formatter(format, params)
  }
}
