import 'babel-polyfill'
import {takeEvery, put, call, select} from 'redux-saga/effects'
import {destroy} from 'utils/http'
import {
  deleteParticipantSaga,
  deleteParticipant,
} from 'sagas/deleteParticipantSaga'
import {DELETE_PERSON} from 'actions/personCardActions'
import {fetch as fetchAllegations} from 'actions/screeningAllegationsActions'
import {selectClientIds, selectParticipants} from 'selectors/participantSelectors'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import * as personCardActions from 'actions/personCardActions'
import {fetchHistoryOfInvolvements} from 'actions/historyOfInvolvementActions'
import {fetchRelationships, setCreateRelationButtonStatus} from 'actions/relationshipsActions'

describe('deleteParticipantSaga', () => {
  it('deletes participant on DELETE_PERSON', () => {
    const gen = deleteParticipantSaga()
    expect(gen.next().value).toEqual(takeEvery(DELETE_PERSON, deleteParticipant))
  })
})

describe('deleteParticipant', () => {
  const id = '123'
  const action = personCardActions.deletePerson(id)

  it('deletes and puts participant, fetches a screening, fetches relationships and sets the relationshipsButtonStatus', () => {
    const gen = deleteParticipant(action)
    expect(gen.next().value).toEqual(select(getScreeningIdValueSelector))
    const screeningId = '444'
    expect(gen.next(screeningId).value).toEqual(call(destroy, `/api/v1/screenings/${screeningId}/participants/123`))
    expect(gen.next().value).toEqual(
      put(personCardActions.deletePersonSuccess(id))
    )
    expect(gen.next('444').value).toEqual(
      put(fetchAllegations('444'))
    )
    expect(gen.next().value).toEqual(select(selectClientIds))
    const clientIds = ['456', '789']
    expect(gen.next(clientIds).value).toEqual(
      put(fetchRelationships(clientIds, screeningId))
    )
    expect(gen.next('444').value).toEqual(
      put(fetchHistoryOfInvolvements('screenings', '444'))
    )
    expect(gen.next().value).toEqual(select(selectParticipants))
    const participants = [{legacy_id: 'ABC'}, {legacy_id: 'DEF'}]
    expect(gen.next(participants).value).toEqual(put(setCreateRelationButtonStatus(participants)))
  })

  it('puts errors when errors are thrown', () => {
    const error = {responseJSON: 'some error'}
    const gen = deleteParticipant(action)
    expect(gen.next().value).toEqual(select(getScreeningIdValueSelector))
    const screeningId = '444'
    expect(gen.next(screeningId).value).toEqual(call(destroy, `/api/v1/screenings/${screeningId}/participants/123`))
    expect(gen.throw(error).value).toEqual(
      put(personCardActions.deletePersonFailure('some error'))
    )
  })
})
