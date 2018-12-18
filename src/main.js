import Core from './core/api'

export {Core} from '@/core'
export {I18n} from '@/i18n'
export {Container} from '@/container'
export {Dom} from '@/dom'

/*
 * Extend UI framework object.
 */
if (window.UiFramework) {
  window.UiFramework = Object.assign({}, window.UiFramework, Core.UiFramework)
}
