import {takeLatest, put, call, select} from 'redux-saga/effects'
import {STATUS_CODES, post} from 'utils/http'
import {
  CREATE_PERSON,
  createPersonSuccess,
  createPersonFailure,
} from 'actions/personCardActions'
import {fetchHistoryOfInvolvements} from 'actions/historyOfInvolvementActions'
import {fetchRelationships, setCreateRelationButtonStatus} from 'actions/relationshipsActions'
import {selectClientIds, selectParticipants} from 'selectors/participantSelectors'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import {replace} from 'react-router-redux'
import {
  createScreeningSuccess,
} from 'actions/screeningActions'

export function* sendPersonPayload(person) {
  const {screening_id, legacy_descriptor, sealed, sensitive} = person
  const {legacy_id, legacy_source_table} = legacy_descriptor || {}
  let id
  if (screening_id === undefined) {
    const screeningResponse = yield call(post, '/api/v1/screenings')
    id = screeningResponse.id
    yield put(createScreeningSuccess(screeningResponse))
    const screeningEditPath = `/screenings/${id}/edit`
    yield put(replace(screeningEditPath))
  }
  const participantPayload = {
    participant: {
      screening_id: screening_id || id,
      legacy_descriptor: {
        legacy_id,
        legacy_table_name: legacy_source_table,
      },
      sealed: sealed || false,
      sensitive: sensitive || false,
    },
  }
  return yield call(post, '/api/v1/participants', participantPayload)
}

export function* createParticipant({payload: {person}}) {
  try {
    const response = yield* sendPersonPayload(person)
    yield put(createPersonSuccess(response))
    const clientIds = yield select(selectClientIds)
    const screeningId = yield select(getScreeningIdValueSelector)
    yield put(fetchRelationships(clientIds, screeningId))
    yield put(fetchHistoryOfInvolvements('screenings', screeningId))
    const participants = yield select(selectParticipants)
    yield put(setCreateRelationButtonStatus(participants))
  } catch (error) {
    if (error.status === STATUS_CODES.forbidden) {
      yield call(alert, 'You are not authorized to add this person.')
    } else {
      yield put(createPersonFailure(error.responseJSON))
    }
  }
}
export function* createParticipantSaga() {
  yield takeLatest(CREATE_PERSON, createParticipant)
}
