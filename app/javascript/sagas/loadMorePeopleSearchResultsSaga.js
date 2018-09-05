import {takeEvery, put, call, select} from 'redux-saga/effects'
import {
  getSearchTermValueSelector,
  getLastResultsSortValueSelector,
} from 'selectors/peopleSearchSelectors'
import {get} from 'utils/http'
import {
  LOAD_MORE_RESULTS,
  loadMoreResultsSuccess,
  loadMoreResultsFailure,
} from 'actions/peopleSearchActions'

export function* loadMorePeopleSearch({payload: {isClientOnly}}) {
  try {
    const searchTerm = yield select(getSearchTermValueSelector)
    const sort = yield select(getLastResultsSortValueSelector)
    const response = yield call(
      get,
      '/api/v1/people/search',
      {search_term: searchTerm, search_after: sort, is_client_only: isClientOnly}
    )
    yield put(loadMoreResultsSuccess(response))
  } catch (error) {
    yield put(loadMoreResultsFailure(error))
  }
}

export function* loadMorePeopleSearchResultsSaga() {
  yield takeEvery(LOAD_MORE_RESULTS, loadMorePeopleSearch)
}
