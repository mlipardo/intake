import {put, call, select, takeEvery} from 'redux-saga/effects'
import {BATCH_CREATE_RELATIONSHIPS} from 'actions/relationshipsActions'
import {batchCreateRelationshipsSuccess, batchCreateRelationshipsFaliure} from 'actions/relationshipsActions'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import {selectCandidatesWithEdits} from 'selectors/screening/candidateSelectors'
import {selectClientIds} from 'selectors/participantSelectors'
import {fetchRelationships} from 'actions/relationshipsActions'
import {post} from 'utils/http'

export function* createRelationships({payload: {personId}}) {
  try {
    const relationshipsWithEdit = yield select(selectCandidatesWithEdits, personId)
    const relationships = relationshipsWithEdit.toJS()
    const response = yield call(post, '/api/v1/relationships', relationships)
    yield put(batchCreateRelationshipsSuccess(response))
    const screeningId = yield select(getScreeningIdValueSelector)
    const clientIds = yield select(selectClientIds)
    yield put(fetchRelationships(clientIds, screeningId))
  } catch (error) {
    yield put(batchCreateRelationshipsFaliure(error))
  }
}

export function* createRelationshipsSaga() {
  yield takeEvery(BATCH_CREATE_RELATIONSHIPS, createRelationships)
}
