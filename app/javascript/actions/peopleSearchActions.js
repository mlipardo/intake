export const PEOPLE_SEARCH_FETCH = 'PEOPLE_SEARCH/FETCH'
export const PEOPLE_SEARCH_FETCH_COMPLETE = 'PEOPLE_SEARCH/FETCH_COMPLETE'
export const PEOPLE_SEARCH_CLEAR = 'PEOPLE_SEARCH/CLEAR'
export const SET_SEARCH_TERM = 'PEOPLE_SEARCH/SET_SEARCH_TERM'
export const SET_SEARCH_COUNTY = 'PEOPLE_SEARCH/SET_SEARCH_COUNTY'
export const LOAD_MORE_RESULTS = 'PEOPLE_SEARCH/LOAD_MORE_RESULTS'
export const LOAD_MORE_RESULTS_COMPLETE = 'PEOPLE_SEARCH/LOAD_MORE_RESULTS_COMPLETE'
export const TOGGLE_ADDRESS_SEARCH = 'TOGGLE_ADDRESS_SEARCH'
export const setSearchTerm = (searchTerm) => ({
  type: SET_SEARCH_TERM,
  payload: {searchTerm},
})
export const setSearchCounty = (county) => ({
  type: SET_SEARCH_COUNTY,
  payload: {county},
})
export const search = (searchTerm, isClientOnly) => ({
  type: PEOPLE_SEARCH_FETCH,
  payload: {searchTerm, isClientOnly},
})
export const loadMoreResults = (isClientOnly) => ({
  type: LOAD_MORE_RESULTS,
  payload: {isClientOnly},
})
export const loadMoreResultsFailure = (error) => ({
  type: LOAD_MORE_RESULTS_COMPLETE,
  payload: {error},
  error: true,
})
export const loadMoreResultsSuccess = ({hits: {hits}}) => ({
  type: LOAD_MORE_RESULTS_COMPLETE,
  payload: {results: hits},
})
export const fetchSuccess = ({hits: {hits, total}}) => ({
  type: PEOPLE_SEARCH_FETCH_COMPLETE,
  payload: {results: hits, total},
})
export const fetchFailure = (error) => ({
  type: PEOPLE_SEARCH_FETCH_COMPLETE,
  payload: {error},
  error: true,
})
export const clear = () => ({
  type: PEOPLE_SEARCH_CLEAR,
})
export const toggleAddressSearch = () => ({
  type: TOGGLE_ADDRESS_SEARCH,
})
