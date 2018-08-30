import {
  List,
  Map,
} from 'immutable'
import {
  selectCounties,
  systemCodeDisplayValue,
} from 'selectors/systemCodeSelectors'
import {
  mapLanguages,
  mapIsSensitive,
  mapIsSealed,
  mapIsProbationYouth,
  mapRaces,
  mapEthnicities,
  mapAddress,
  mapPhoneNumber,
} from 'utils/peopleSearchHelper'
import {isCommaSuffix, formatHighlightedSuffix} from 'utils/nameFormatter'
import {phoneNumberFormatter} from 'utils/phoneNumberFormatter'

const getPeopleSearchSelector = (state) => state.get('peopleSearch')
export const getSearchTermValueSelector = (state) => (
  getPeopleSearchSelector(state).get('searchTerm')
)
export const getResultsTotalValueSelector = (state) => (
  getPeopleSearchSelector(state).get('total')
)
export const getLastResultsSortValueSelector = (state) => {
  const lastResult = getPeopleSearchSelector(state).get('results').last()
  return lastResult.get('sort').toJS()
}

const formatSSN = (ssn) => ssn && ssn.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3')
const formatDOB = (dob, highlight) => (highlight ? '<em>'.concat(dob, '</em>') : dob)
const formatPhoneNumber = (phoneNumber) => (phoneNumber ? Map({
  number: phoneNumberFormatter(phoneNumber.get('number')),
  type: phoneNumber.get('type'),
}) : null)

// Try to find a match from a list of highlights by stripping out <em> tags
const highlightNameField = (exactName, highlights) => (highlights.find(
  (highlight) => highlight.replace(/<(\/)?em>/g, '') === exactName
))

const maybeHighlightedField = (result, highlight, key) => highlight.getIn(
  [key, 0],
  highlightNameField(
    result.get(key),
    highlight.get('autocomplete_search_bar', List())
  )
)

const combineFullName = (firstName, middleName, lastName, nameSuffix, isCommaSuffix) => {
  const nameStem = [firstName, middleName, lastName].filter(Boolean).join(' ')

  if (nameSuffix) {
    return `${nameStem}${isCommaSuffix ? ',' : ''} ${nameSuffix}`
  }

  return nameStem
}

const formatFullName = (result, highlight) => combineFullName(
  maybeHighlightedField(result, highlight, 'first_name') || result.get('first_name'),
  maybeHighlightedField(result, highlight, 'middle_name') || result.get('middle_name'),
  maybeHighlightedField(result, highlight, 'last_name') || result.get('last_name'),
  formatHighlightedSuffix(maybeHighlightedField(result, highlight, 'name_suffix') || result.get('name_suffix')),
  isCommaSuffix(result.get('name_suffix'))
)

const mapCounties = (counties, countyCodes) => counties.map((county) =>
  systemCodeDisplayValue(county.get('id'), countyCodes)
)

export const getPeopleResultsSelector = (state) => getPeopleSearchSelector(state)
  .get('results')
  .map((fullResult) => {
    const result = fullResult.get('_source', Map())
    const highlight = fullResult.get('highlight', Map())
    return Map({
      legacy_id: result.get('id'),
      fullName: formatFullName(result, highlight),
      legacyDescriptor: result.get('legacy_descriptor'),
      gender: result.get('gender'),
      languages: mapLanguages(state, result),
      races: mapRaces(state, result),
      ethnicity: mapEthnicities(state, result),
      dateOfBirth: formatDOB(result.get('date_of_birth'), highlight.has('searchable_date_of_birth')),
      isDeceased: Boolean(result.get('date_of_death')),
      ssn: formatSSN(maybeHighlightedField(result, highlight, 'ssn') || result.get('ssn')),
      clientCounties: mapCounties(result.get('client_counties', List()), selectCounties(state)),
      address: mapAddress(state, result),
      phoneNumber: formatPhoneNumber(mapPhoneNumber(result).first()),
      isSensitive: mapIsSensitive(result),
      isSealed: mapIsSealed(result),
      isProbationYouth: mapIsProbationYouth(result),
    })
  })

export const getStartTimeSelector = (state) => getPeopleSearchSelector(state)
  .get('startTime')

export const getPersonCreatedAtTimeSelector = (state) =>
  state.get('relationshipsQueryCycleTime').toJS()
    .map((t) => t.personCreatedAtTime)
    .pop()

