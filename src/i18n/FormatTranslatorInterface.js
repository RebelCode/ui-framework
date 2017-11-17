// @flow

export interface FormatTranslatorInterface {
  translate(format: string, params?: Array<mixed>, context?: string): string;
}
