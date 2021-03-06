import {createReducer} from 'utils/createReducer'
import {fromJS} from 'immutable'
import {
  TOGGLE_ADDRESS_SEARCH,
  PEOPLE_SEARCH_CLEAR,
  PEOPLE_SEARCH_FETCH,
  PEOPLE_SEARCH_FETCH_COMPLETE,
  SET_SEARCH_TERM,
  SET_SEARCH_COUNTY,
  LOAD_MORE_RESULTS_COMPLETE,
} from 'actions/peopleSearchActions'
import {FETCH_USER_INFO_COMPLETE} from 'actions/userInfoActions'
import moment from 'moment'

const initialState = fromJS({
  results: [],
  searchTerm: '',
  total: 0,
  isAddressIncluded: false,
  county: '',
})
export default createReducer(initialState, {
  [PEOPLE_SEARCH_FETCH](state, {payload: {searchTerm}}) {
    return state.set('searchTerm', searchTerm)
      .set('total', null)
  },
  [PEOPLE_SEARCH_FETCH_COMPLETE](state, {payload: {results, total}, error}) {
    if (error) {
      return state
    } else {
      return state.set('results', fromJS(results))
        .set('total', total)
    }
  },
  [PEOPLE_SEARCH_CLEAR](state, _action) {
    return state.set('results', fromJS([]))
      .set('startTime', null)
      .set('total', null)
  },
  [SET_SEARCH_TERM](state, {payload: {searchTerm}}) {
    if (state.get('startTime')) {
      return state.set('searchTerm', searchTerm)
    } else if (searchTerm) {
      return state.set('searchTerm', searchTerm)
        .set('startTime', moment().toISOString())
    } else {
      return state.set('searchTerm', searchTerm)
        .set('startTime', null)
    }
  },
  [SET_SEARCH_COUNTY](state, {payload: {county}}) {
    return state.set('county', county)
  },
  [FETCH_USER_INFO_COMPLETE](state, {payload: {userInfo: {county}}}) {
    return state.get('county') === '' ? state.set('county', county) : state
  },
  [LOAD_MORE_RESULTS_COMPLETE](state, {payload: {results}, error}) {
    if (error) {
      return state
    } else {
      return state.update('results', (arr) => arr.concat(fromJS(results)))
    }
  },
  [TOGGLE_ADDRESS_SEARCH](state) {
    return state.set('isAddressIncluded', !state.get('isAddressIncluded'))
  },
})
