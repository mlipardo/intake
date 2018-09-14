import {Map} from 'immutable'
import {createSelector} from 'reselect'
import {SHOW_MODE} from 'actions/screeningPageActions'
import {selectParticipants} from 'selectors/participantSelectors'
import {participantFlag} from 'utils/accessIndicator'
import nameFormatter from 'utils/nameFormatter'

export const getPersonNamesSelector = createSelector(
  selectParticipants,
  (people) => people.reduce((namesMap, person) => (
    namesMap.set(person.get('id'), nameFormatter(person.toJS()))
  ), Map())
)

export const selectCsec = createSelector(
  selectParticipants,
  (people) => people.reduce((namesMap, person) => (
    namesMap.set(person.get('id'), person.get('csec'))
  ), Map())
)

export const selectDeceased = createSelector(
  selectParticipants,
  (people) => people.reduce((namesMap, person) => (
    namesMap.set(person.get('id'), person.get('date_of_death'))
  ), Map())
)

export const selectProbationYouth = createSelector(
  selectParticipants,
  (people) => people.reduce((namesMap, person) => (
    namesMap.set(person.get('id'), person.get('probation_youth'))
  ), Map())
)

export const getPersonInformationFlagValuesSelector = createSelector(
  selectParticipants,
  (people) => people.reduce((informationFlagMap, person) => (
    informationFlagMap.set(person.get('id'), participantFlag(person.toJS()))
  ), Map())
)
export const getModeValueSelector = (state, personId) => {
  const screeningPage = state.get('screeningPage')
  return screeningPage.getIn(['peopleCards', personId], SHOW_MODE)
}

export const selectInformationalMessage = (state, personId) => {
  const probationYouthInfo = selectProbationYouth(state).get(personId)
  const deceasedInfo = selectDeceased(state).get(personId)
  const csecInfo = selectCsec(state).get(personId)
  if (deceasedInfo) {
    return 'Deceased'
  } else if (probationYouthInfo) {
    return 'Probation Youth'
  } else if (csecInfo && csecInfo.size > 0) {
    return 'CSEC'
  }
  return null
}
