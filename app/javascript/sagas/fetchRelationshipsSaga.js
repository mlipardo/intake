import {takeLatest, put, call, select} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  fetchRelationshipsSuccess,
  fetchRelationshipsFailure,
} from 'actions/relationshipsActions'
import {
  FETCH_RELATIONSHIPS,
} from 'actions/actionTypes'
import {clearTime} from 'actions/personCardActions'
import moment from 'moment'
import {selectPersonCreatedAtTime} from 'selectors/peopleSearchSelectors'
import {logEvent} from 'utils/analytics'
import {getStaffIdSelector} from 'selectors/userInfoSelectors'

export const currentTime = () => moment().valueOf()

export function* fetchRelationships({payload: {ids, screeningId}}) {
  try {
    const response = yield call(get, `/api/v1/relationships?clientIds=${ids.join(',')}&screeningId=${screeningId}`)
    yield put(fetchRelationshipsSuccess(response))
    const staffId = yield select(getStaffIdSelector)
    const personCreatedAtTime = yield select(selectPersonCreatedAtTime)
    const fetchRelationshipTime = yield select(currentTime)
    if (personCreatedAtTime) {
      const relationshipsQueryCycleTime = fetchRelationshipTime - personCreatedAtTime
      yield call(logEvent, 'relationshipsQueryCycleTime', {
        relationshipsQueryCycleTime: relationshipsQueryCycleTime,
        staffId: staffId,
      })
      yield put(clearTime())
    }
  } catch (error) {
    yield put(fetchRelationshipsFailure(error.responseJSON))
  }
}

export function* fetchRelationshipsSaga() {
  yield takeLatest(FETCH_RELATIONSHIPS, fetchRelationships)
}
