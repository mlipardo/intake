import 'babel-polyfill'
import {takeEvery, put, call, select} from 'redux-saga/effects'
import * as Utils from 'utils/http'
import {
  saveParticipantSaga,
  saveParticipant,
} from 'sagas/saveParticipantSaga'
import {UPDATE_PERSON} from 'actions/personCardActions'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import {fetch as fetchAllegations} from 'actions/screeningAllegationsActions'
import * as personCardActions from 'actions/personCardActions'
import {fromJS} from 'immutable'
import {selectClientIds} from 'selectors/participantSelectors'
import {getPersonWithEditsSelector} from 'selectors/screening/personFormSelectors'
import {fetchRelationships} from 'actions/relationshipsActions'
import {fetchHistoryOfInvolvements} from 'actions/historyOfInvolvementActions'

describe('saveParticipantSaga', () => {
  it('updates participant on UPDATE_PERSON', () => {
    const gen = saveParticipantSaga()
    expect(gen.next().value).toEqual(takeEvery(UPDATE_PERSON, saveParticipant))
  })
})

describe('saveParticipant', () => {
  const id = '123'
  const participant = {id, name: 'test'}
  const action = personCardActions.savePerson(id)

  it('saves and puts participant and fetches allegations', () => {
    const gen = saveParticipant(action)
    expect(gen.next().value).toEqual(
      select(getPersonWithEditsSelector, id)
    )
    expect(gen.next(fromJS(participant)).value).toEqual(
      call(Utils.put, '/api/v1/participants/123', participant)
    )
    expect(gen.next(participant).value).toEqual(
      put(personCardActions.updatePersonSuccess(participant))
    )
    expect(gen.next().value).toEqual(select(selectClientIds))
    const clientIds = ['123', '456']
    expect(gen.next(clientIds).value).toEqual(select(getScreeningIdValueSelector))
    const screeninngId = '444'
    expect(gen.next(screeninngId).value).toEqual(
      put(fetchAllegations(screeninngId))
    )
    expect(gen.next().value).toEqual(
      put(fetchRelationships(clientIds, screeninngId))
    )
    expect(gen.next().value).toEqual(
      put(fetchHistoryOfInvolvements('screenings', screeninngId))
    )
  })

  it('puts errors when errors are thrown', () => {
    const gen = saveParticipant(action)
    expect(gen.next().value).toEqual(
      select(getPersonWithEditsSelector, id)
    )
    expect(gen.next(fromJS(participant)).value).toEqual(
      call(Utils.put, '/api/v1/participants/123', participant)
    )
    const error = {responseJSON: 'some error'}
    expect(gen.throw(error).value).toEqual(
      put(personCardActions.updatePersonFailure('some error', id))
    )
  })
})
