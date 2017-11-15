// @flow

import di from '../services/di'
import selectors from './selectors'

di.factory('selectorList', function () {
  return selectors
})
