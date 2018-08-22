import {takeEvery, put, call, select} from 'redux-saga/effects'
import {post} from 'utils/http'
import {
  submitScreeningSuccess,
  submitScreeningFailure,
} from 'actions/screeningActions'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {SUBMIT_SCREENING} from 'actions/actionTypes'

export function* submitScreening({payload: {id}}) {
  try {
    const response = yield call(post, `/api/v1/screenings/${id}/submit`)
    yield put(submitScreeningSuccess(response))
    const screening = yield select(getScreeningSelector)
  } catch (error) {
    yield put(submitScreeningFailure(error))
  }
}
export function* submitScreeningSaga() {
  yield takeEvery(SUBMIT_SCREENING, submitScreening)
}
