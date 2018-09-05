import {takeEvery, put, call, select} from 'redux-saga/effects'
import * as Utils from 'utils/http'
import {
  UPDATE_PERSON,
  updatePersonSuccess,
  updatePersonFailure,
} from 'actions/personCardActions'
import {fetch as fetchAllegations} from 'actions/screeningAllegationsActions'
import {selectClientIds} from 'selectors/participantSelectors'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import {getPersonWithEditsSelector} from 'selectors/screening/personFormSelectors'
import {fetchRelationships} from 'actions/relationshipsActions'
import {fetchHistoryOfInvolvements} from 'actions/historyOfInvolvementActions'

export function* saveParticipant({payload: {personId}}) {
  try {
    const personWithEdits = yield select(getPersonWithEditsSelector, personId)
    const person = personWithEdits.toJS()
    const response = yield call(Utils.put, `/api/v1/participants/${personId}`, person)
    yield put(updatePersonSuccess(response))
    const clientIds = yield select(selectClientIds)
    const screeningId = yield select(getScreeningIdValueSelector)
    yield put(fetchAllegations(screeningId))
    yield put(fetchRelationships(clientIds, screeningId))
    yield put(fetchHistoryOfInvolvements('screenings', screeningId))
  } catch (error) {
    yield put(updatePersonFailure(error.responseJSON, personId))
  }
}
export function* saveParticipantSaga() {
  yield takeEvery(UPDATE_PERSON, saveParticipant)
}
