import 'babel-polyfill'
import {
  BATCH_CREATE_RELATIONSHIPS,
  batchCreateRelationships,
  batchCreateRelationshipsFaliure,
  batchCreateRelationshipsSuccess,
} from 'actions/relationshipsActions'
import {call, put, select, takeEvery} from 'redux-saga/effects'
import {createRelationshipsSaga, createRelationships} from 'sagas/createRelationshipsSaga'
import {fetchRelationships} from 'actions/relationshipsActions'
import {fromJS} from 'immutable'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import {post} from 'utils/http'
import {selectCandidatesWithEdits} from 'selectors/screening/candidateSelectors'
import {selectClientIds} from 'selectors/participantSelectors'

describe('createRelationshipsSaga', () => {
  it('creates new relationships on BATCH_CREATE_RELATIONSHIPS', () => {
    const gen = createRelationshipsSaga()

    expect(gen.next().value).toEqual(takeEvery(BATCH_CREATE_RELATIONSHIPS, createRelationships))
  })
})

describe('createRelationships', () => {
  const relationshipsWithEdits = [{
    client_id: 'ZXY123',
    relative_id: 'ABC987',
    relationship_type: 190,
    absent_parent_indicator: false,
    same_home_status: 'N',
    start_date: '',
    end_date: '',
    legacy_id: '',
  }, {
    client_id: '805',
    relative_id: '415',
    relationship_type: 191,
    absent_parent_indicator: false,
    same_home_status: 'N',
    start_date: '',
    end_date: '',
    legacy_id: '',
  }]
  const personId = '808'
  const action = batchCreateRelationships(personId)

  it('creates batch relationship and fetches relationships', () => {
    const clientIds = ['123', '456']
    const screeningId = '1'
    const gen = createRelationships(action)

    expect(gen.next().value).toEqual(
      select(selectCandidatesWithEdits, personId)
    )
    expect(gen.next(fromJS(relationshipsWithEdits)).value).toEqual(
      call(post, '/api/v1/relationships', relationshipsWithEdits)
    )
    expect(gen.next(relationshipsWithEdits).value).toEqual(
      put(batchCreateRelationshipsSuccess(relationshipsWithEdits))
    )
    expect(gen.next().value).toEqual(
      select(getScreeningIdValueSelector)
    )
    expect(gen.next(screeningId).value).toEqual(
      select(selectClientIds)
    )
    expect(gen.next(clientIds).value).toEqual(
      put(fetchRelationships(clientIds, screeningId))
    )
  })

  it('puts errors when errors are thrown', () => {
    const gen = createRelationships(action)

    expect(gen.next().value).toEqual(
      select(selectCandidatesWithEdits, personId)
    )
    expect(gen.next(fromJS(relationshipsWithEdits)).value).toEqual(
      call(post, '/api/v1/relationships', relationshipsWithEdits)
    )
    const error = {responseJSON: 'some error'}
    expect(gen.throw(error).value).toEqual(
      put(batchCreateRelationshipsFaliure(error))
    )
  })
})
