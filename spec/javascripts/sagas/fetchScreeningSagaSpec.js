import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {fetchScreeningSaga, fetchScreening} from 'sagas/fetchScreeningSaga'
import {FETCH_SCREENING} from 'actions/actionTypes'
import * as actions from 'actions/screeningActions'
import {fetch as fetchCountyAgencies} from 'actions/countyAgenciesActions'
import {fetchRelationships, setCreateRelationButtonStatus} from 'actions/relationshipsActions'
import {replace} from 'react-router-redux'

describe('fetchScreeningSaga', () => {
  it('fetches screening on FETCH_SCREENING', () => {
    const gen = fetchScreeningSaga()
    expect(gen.next().value).toEqual(takeEvery(FETCH_SCREENING, fetchScreening))
  })
})

describe('fetchScreening', () => {
  describe('without id', () => {
    it('fetch screening without id', () => {
      const action = actions.fetchScreening(null)
      const gen = fetchScreening(action)
      const screening = {id: null, cross_reports: []}
      expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/new'))
      expect(gen.next(screening).value).toEqual(
        put(actions.fetchScreeningSuccess(screening))
      )
    })
  })

  describe('when successful', () => {
    const id = '123'
    const action = actions.fetchScreening(id)
    it('fetches and puts screening with cross report data', () => {
      const gen = fetchScreening(action)
      expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      const screening = {id, cross_reports: [{county_id: '1234'}]}
      expect(gen.next(screening).value).toEqual(put(fetchCountyAgencies('1234')))
      expect(gen.next(screening).value).toEqual(
        put(actions.fetchScreeningSuccess(screening))
      )
    })
    it('fetches and puts screening without county info data', () => {
      const gen = fetchScreening(action)
      expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      const screening = {id, cross_reports: [{county_id: ''}]}
      expect(gen.next(screening).value).toEqual(
        put(actions.fetchScreeningSuccess(screening))
      )
    })
    it('fetches and puts screening without a cross report', () => {
      const gen = fetchScreening(action)
      expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      const screening = {id, cross_reports: []}
      expect(gen.next(screening).value).toEqual(
        put(actions.fetchScreeningSuccess(screening))
      )
    })
    it('fetches and puts screening without cross report key', () => {
      const gen = fetchScreening(action)
      expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      const screening = {id}
      expect(gen.next(screening).value).toEqual(
        put(actions.fetchScreeningSuccess(screening))
      )
    })
    it('fetches relationships as well', () => {
      const gen = fetchScreening(action)
      expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      const screening = {id, participants: [{legacy_id: 'ABC'}, {legacy_id: 'DEF'}]}
      expect(gen.next(screening).value).toEqual(
        put(actions.fetchScreeningSuccess(screening))
      )
      expect(gen.next(screening).value).toEqual(
        put(fetchRelationships(['ABC', 'DEF'], '123'))
      )
    })

    it('sets the relationshipsButtonStatus', () => {
      const gen = fetchScreening(action)
      expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      const screening = {id, participants: [{legacy_id: 'ABC'}, {legacy_id: 'DEF'}]}
      expect(gen.next(screening).value).toEqual(
        put(actions.fetchScreeningSuccess(screening))
      )
      expect(gen.next(screening).value).toEqual(
        put(fetchRelationships(['ABC', 'DEF'], '123'))
      )
      expect(gen.next(screening).value).toEqual(
        put(setCreateRelationButtonStatus([{legacy_id: 'ABC'}, {legacy_id: 'DEF'}]))
      )
    })
  })

  describe('when unsuccessful', () => {
    const id = '123'
    const action = actions.fetchScreening(id)
    it('returns the error', () => {
      const gen = fetchScreening(action)
      const error = {responseJSON: 'some error'}
      expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      expect(gen.throw(error).value).toEqual(
        put(actions.fetchScreeningFailure('some error'))
      )
    })

    it('redirects to forbidden page if error is 403', () => {
      const saga = fetchScreening(action)
      const error = {responseJSON: 'forbidden', status: 403}
      expect(saga.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      expect(saga.throw(error).value).toEqual(put(replace('/forbidden')))
    })

    it('redirects to not found page if error is 404', () => {
      const saga = fetchScreening(action)
      const error = {responseJSON: 'notFound', status: 404}
      expect(saga.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      expect(saga.throw(error).value).toEqual(put(replace('/notFound')))
    })
  })
})
