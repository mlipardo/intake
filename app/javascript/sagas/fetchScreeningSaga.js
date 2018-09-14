import {takeEvery, put, call} from 'redux-saga/effects'
import {replace} from 'react-router-redux'
import {STATUS_CODES, get} from 'utils/http'
import {
  fetchScreeningSuccess,
  fetchScreeningFailure,
} from 'actions/screeningActions'
import {fetch as fetchCountyAgencies} from 'actions/countyAgenciesActions'
import {fetchRelationships, setCreateRelationButtonStatus} from 'actions/relationshipsActions'
import {FETCH_SCREENING} from 'actions/actionTypes'

function* fetchCrossReports(cross_reports) {
  if (cross_reports && cross_reports.length > 0) {
    const {county_id} = cross_reports[0]
    if (county_id) {
      yield put(fetchCountyAgencies(county_id))
    }
  }
}

function* tryToFetchScreening(id) {
  let response
  if (id) {
    response = yield call(get, `/api/v1/screenings/${id}`)
    const {cross_reports} = response
    yield* fetchCrossReports(cross_reports)
  } else {
    response = yield call(get, '/api/v1/screenings/new')
  }
  yield put(fetchScreeningSuccess(response))
  const clientIds = response.participants && response.participants.map(
    (p) => (p.legacy_id || p.legacy_descriptor && p.legacy_descriptor.legacy_id)
  )
  const screeningId = response.id
  yield put(fetchRelationships(clientIds, screeningId))
  const participants = response.participants
  yield put(setCreateRelationButtonStatus(participants))
}

function* redirectOrFail(error) {
  switch (error.status) {
    case STATUS_CODES.forbidden: {
      yield put(replace('/forbidden'))
      break
    }
    case STATUS_CODES.notFound: {
      yield put(replace('/notFound'))
      break
    }
    default: {
      yield put(fetchScreeningFailure(error.responseJSON))
    }
  }
}

export function* fetchScreening({payload: {id}}) {
  try {
    yield* tryToFetchScreening(id)
  } catch (error) {
    yield* redirectOrFail(error)
  }
}
export function* fetchScreeningSaga() {
  yield takeEvery(FETCH_SCREENING, fetchScreening)
}
