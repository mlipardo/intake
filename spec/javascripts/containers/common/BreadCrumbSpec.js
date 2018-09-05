import {mapStateToProps} from 'containers/common/BreadCrumb'
import React from 'react'
import {fromJS} from 'immutable'

describe('BreadCrumbContainer', () => {
  describe('mapStateToProps', () => {
    it('provides navigation elements', () => {
      const state = fromJS({})
      const navigationElements = [<a key='' href='/'>caseload</a>]
      expect(mapStateToProps(state, {navigationElements})).toEqual({
        hasError: false,
        navigationElements,
      })
    })

    it('provides error status', () => {
      const state = fromJS({
        errors: ['an error'],
      })
      const navigationElements = [<a key='' href='/'>caseload</a>]
      expect(mapStateToProps(state, {navigationElements})).toEqual({
        hasError: true,
        navigationElements,
      })
    })

    it('provides non-error status', () => {
      const state = fromJS({
        errors: [],
      })
      const navigationElements = [<a key='' href='/'>caseload</a>]
      expect(mapStateToProps(state, {navigationElements})).toEqual({
        hasError: false,
        navigationElements,
      })
    })
  })
})
