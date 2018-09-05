import * as matchers from 'jasmine-immutable-matchers'
import {
  clear,
  fetchFailure,
  fetchSuccess,
  toggleAddressSearch,
  search,
  setSearchTerm,
  loadMoreResultsSuccess,
  loadMoreResultsFailure,
} from 'actions/peopleSearchActions'
import peopleSearchReducer from 'reducers/peopleSearchReducer'
import {Map, fromJS} from 'immutable'
import moment from 'moment'

describe('peopleSearchReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))
  describe('on PEOPLE_SEARCH_FETCH', () => {
    it('updates the search term and total', () => {
      const action = search('newSearchTerm')
      expect(peopleSearchReducer(Map(), action)).toEqualImmutable(
        fromJS({
          searchTerm: 'newSearchTerm',
          total: null,
        })
      )
    })
  })
  describe('on PEOPLE_SEARCH_FETCH_COMPLETE', () => {
    const initialState = fromJS({
      searchTerm: 'newSearchTerm',
      total: 0,
    })
    describe('on success', () => {
      const action = fetchSuccess({
        hits: {
          total: 2,
          hits: ['result_one', 'result_two'],
        },
      })
      it('updates search results with hits and sets the new total', () => {
        expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
          fromJS({
            searchTerm: 'newSearchTerm',
            total: 2,
            results: ['result_one', 'result_two'],
          })
        )
      })
    })
    describe('on failure', () => {
      const action = fetchFailure()
      it('leaves state unchanged', () => {
        expect(peopleSearchReducer(initialState, action)).toEqualImmutable(initialState)
      })
    })
  })
  describe('on PEOPLE_SEARCH_CLEAR', () => {
    const initialState = fromJS({
      searchTerm: 'newSearchTerm',
      total: 3,
      results: ['result_one', 'result_two', 'result_three'],
    })
    const action = clear()
    it('resets results, total, and startTime', () => {
      expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
        fromJS({
          searchTerm: 'newSearchTerm',
          total: null,
          results: [],
          startTime: null,
        })
      )
    })
  })
  describe('on SET_SEARCH_TERM', () => {
    it('resets results, total and sets startTime', () => {
      const action = setSearchTerm('something')
      const initialState = fromJS({
        searchTerm: 'newSearchTerm',
        total: 3,
        results: ['result_one', 'result_two', 'result_three'],
      })
      const today = moment('2015-10-19').toDate()
      jasmine.clock().mockDate(today)
      expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
        fromJS({
          searchTerm: 'something',
          total: 3,
          results: ['result_one', 'result_two', 'result_three'],
          startTime: today.toISOString(),
        })
      )
      jasmine.clock().uninstall()
    })

    it('resets the start time when there is no search term', () => {
      const action = setSearchTerm('')
      const initialState = fromJS({
        searchTerm: '',
        total: 0,
        results: [],
      })
      expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
        fromJS({
          searchTerm: '',
          total: 0,
          results: [],
          startTime: null,
        })
      )
    })
  })
  describe('on LOAD_MORE_RESULTS_COMPLETE', () => {
    const initialState = fromJS({
      searchTerm: 'newSearchTerm',
      total: 4,
      results: ['result_one', 'result_two'],
    })
    describe('on success', () => {
      const action = loadMoreResultsSuccess({
        hits: {
          hits: ['result_three', 'result_four'],
        },
      })
      it('updates search results with hits', () => {
        expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
          fromJS({
            searchTerm: 'newSearchTerm',
            total: 4,
            results: [
              'result_one', 'result_two', 'result_three', 'result_four',
            ],
          })
        )
      })
    })
    describe('on failure', () => {
      const action = loadMoreResultsFailure()
      it('leaves state unchanged', () => {
        expect(peopleSearchReducer(initialState, action)).toEqualImmutable(initialState)
      })
    })
  })

  describe('on TOGGLE_ADDRESS_SEARCH', () => {
    const action = toggleAddressSearch()
    it('toggle isAddressIncluded flag from false to true', () => {
      const initialState = fromJS({isAddressIncluded: false})
      expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
        fromJS({
          isAddressIncluded: true,
        })
      )
    })
    it('toggle isAddressIncluded flag from true to false', () => {
      const initialState = fromJS({isAddressIncluded: true})
      expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
        fromJS({
          isAddressIncluded: false,
        })
      )
    })
  })
})
