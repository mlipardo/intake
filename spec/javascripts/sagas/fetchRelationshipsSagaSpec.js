import 'babel-polyfill'
import {takeLatest, put, call, select} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  fetchRelationshipsSaga,
  fetchRelationships,
  currentTime,
} from 'sagas/fetchRelationshipsSaga'
import {FETCH_RELATIONSHIPS} from 'actions/actionTypes'
import * as actions from 'actions/relationshipsActions'
import {selectPersonCreatedAtTime} from 'selectors/peopleSearchSelectors'
import moment from 'moment'
import {logEvent} from 'utils/analytics'
import {clearTime} from 'actions/personCardActions'
import {getStaffIdSelector} from 'selectors/userInfoSelectors'

describe('fetchRelationshipsSaga', () => {
  it('fetches relationships on FETCH_RELATIONSHIPS', () => {
    const gen = fetchRelationshipsSaga()
    expect(gen.next().value).toEqual(
      takeLatest(FETCH_RELATIONSHIPS, fetchRelationships)
    )
  })
})

describe('fetchRelationships', () => {
  const ids = ['a', 'b', 'c']
  const screeningId = '123'
  const action = actions.fetchRelationships(ids, screeningId)
  const personCreatedAtTime = 1534190832860
  const staffId = '0X5'

  it('should fetch and put relationships', () => {
    const gen = fetchRelationships(action)

    expect(gen.next().value).toEqual(
      call(get, '/api/v1/relationships?clientIds=a,b,c&screeningId=123')
    )

    const relationships = [{id: 'a'}, {id: 'b'}, {id: 'c'}]
    expect(gen.next(relationships).value).toEqual(
      put(actions.fetchRelationshipsSuccess(relationships))
    )
    expect(gen.next().value).toEqual(
      select(getStaffIdSelector)
    )
    expect(gen.next(staffId).value).toEqual(
      select(selectPersonCreatedAtTime)
    )
    const fetchRelationshipTime = moment().valueOf()
    const relationshipsQueryCycleTime = fetchRelationshipTime - personCreatedAtTime
    expect(gen.next(personCreatedAtTime).value).toEqual(select(currentTime))
    expect(gen.next(fetchRelationshipTime).value).toEqual(call(logEvent, 'relationshipsQueryCycleTime', {
      relationshipsQueryCycleTime: relationshipsQueryCycleTime,
      staffId: staffId,
    }))
    expect(gen.next().value).toEqual(
      put(clearTime())
    )
  })

  it('should put errors when errors are thrown', () => {
    const gen = fetchRelationships(action)
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/relationships?clientIds=a,b,c&screeningId=123')
    )
    const error = {responseJSON: 'some error'}
    expect(gen.throw(error).value).toEqual(
      put(actions.fetchRelationshipsFailure('some error'))
    )
  })
})
