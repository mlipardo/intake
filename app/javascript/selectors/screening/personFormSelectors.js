import {createSelector} from 'reselect'
import {fromJS, List, Map} from 'immutable'
import {isReadOnly, toFerbAddress} from 'data/address'
import {ROLE_TYPE_NON_REPORTER, ROLE_TYPE_REPORTER} from 'enums/RoleType'
import {getSSNErrors} from 'utils/ssnValidator'
import {isRequiredIfCreate, combineCompact} from 'utils/validator'
import moment from 'moment'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import {getReportType} from 'selectors/screening/screeningInformationShowSelectors'
import {selectParticipants} from 'selectors/participantSelectors'
import {selectAddresses} from 'selectors/screening/personAddressesFormSelectors'
import {hasReporter} from 'utils/roles'

export const getPeopleSelector = (state) => state.get('peopleForm')

const calculateAgeFromScreeningDate = (state, personId) => {
  const screeningStartDate = moment(state.getIn(['screeningInformationForm', 'started_at', 'value']))
  const person = state.getIn(['peopleForm', personId])
  const dateOfBirth = person.getIn(['date_of_birth', 'value'])
  const approximateAge = parseInt(person.getIn(['approximate_age', 'value']), 10)
  const approximateAgeUnit = person.getIn(['approximate_age_units', 'value'])

  if (dateOfBirth) {
    return screeningStartDate.diff(moment(dateOfBirth, 'MM/DD/YYYY'), 'years')
  }
  if (approximateAge && approximateAgeUnit) {
    return moment().diff(screeningStartDate, 'years') + moment.duration(approximateAge, approximateAgeUnit).asYears()
  }
  return undefined
}

const ageFromScreeningDateIsEmpty = (state, personId) => {
  const ageFromScreeningDate = calculateAgeFromScreeningDate(state, personId)

  return typeof ageFromScreeningDate !== 'number'
}

const isOver18YearsOfAgeAtScreeningDate = (state, personId) => {
  const ageFromScreeningDate = calculateAgeFromScreeningDate(state, personId)
  const ageLimit = 18
  return ageFromScreeningDate && ageFromScreeningDate >= ageLimit
}

const getRoleErrors = (state, personId, roles) => combineCompact(() => {
  if (roles.includes('Victim') && (ageFromScreeningDateIsEmpty(state, personId) || isOver18YearsOfAgeAtScreeningDate(state, personId))) {
    return 'Alleged victims must be under 18 years old.'
  }
  return undefined
})

export const getNamesRequiredSelector = (state, personId) => {
  const roles = state.getIn(['peopleForm', personId, 'roles', 'value']) || List()
  return (
    roles.size !== 0 && !List(['Anonymous Reporter']).equals(roles)
  )
}

export const getErrorsSelector = (state, personId) => {
  const person = state.getIn(['peopleForm', personId]) || Map()
  const firstName = person.getIn(['first_name', 'value'])
  const lastName = person.getIn(['last_name', 'value'])
  const roles = person.getIn(['roles', 'value'], List())
  const ssn = person.getIn(['ssn', 'value']) || ''
  const ssnWithoutHyphens = ssn.replace(/-|_/g, '')
  return fromJS({
    first_name: combineCompact(isRequiredIfCreate(firstName, 'Please enter a first name.', () => (getNamesRequiredSelector(state, personId)))),
    last_name: combineCompact(isRequiredIfCreate(lastName, 'Please enter a last name.', () => (getNamesRequiredSelector(state, personId)))),
    roles: getRoleErrors(state, personId, roles),
    ssn: getSSNErrors(ssnWithoutHyphens),
  })
}

export const getTouchedFieldsForPersonSelector = (state, personId) => {
  const peopleForm = state.getIn(['peopleForm', personId], Map())
  return peopleForm.filter((field) => field.get('touched')).keySeq().toList()
}

export const getVisibleErrorsSelector = (state, personId) => {
  const touchedFields = getTouchedFieldsForPersonSelector(state, personId)
  const errors = getErrorsSelector(state, personId)
  return errors.reduce(
    (filteredErrors, fieldErrors, field) => (
      filteredErrors.set(field, touchedFields.includes(field) ? fieldErrors : List())
    ), Map())
}

export const getRolesSelector = (state, personId) => {
  const value = state.getIn(['peopleForm', personId, 'roles', 'value'], List())
  const errors = getVisibleErrorsSelector(state, personId).get('roles')
  return fromJS({
    value: value || '',
    errors: errors,
  })
}

export const getFirstNameSelector = (state, personId) => {
  const value = state.getIn(['peopleForm', personId, 'first_name', 'value'])
  const errors = getVisibleErrorsSelector(state, personId).get('first_name')
  const required = getNamesRequiredSelector(state, personId)
  return fromJS({
    value: value || '',
    errors: errors,
    required: required,
  })
}

export const getLastNameSelector = (state, personId) => {
  const value = state.getIn(['peopleForm', personId, 'last_name', 'value'])
  const errors = getVisibleErrorsSelector(state, personId).get('last_name')
  const required = getNamesRequiredSelector(state, personId)
  return fromJS({
    value: value || '',
    errors: errors,
    required: required,
  })
}

export const getSocialSecurityNumberSelector = (state, personId) => (
  fromJS({
    value: state.getIn(['peopleForm', personId, 'ssn', 'value']) || '',
    errors: getVisibleErrorsSelector(state, personId).get('ssn'),
  })
)

const getPhoneNumbers = (person) => person.get('phone_numbers', List()).map((phoneNumber) => Map({
  id: phoneNumber.get('id'),
  number: phoneNumber.getIn(['number', 'value']),
  type: phoneNumber.getIn(['type', 'value']),
}))

const getEthnicity = (person) => {
  const hispanic_latino_origin = person.getIn(['ethnicity', 'hispanic_latino_origin', 'value'])
  const ethnicity_detail = (hispanic_latino_origin === 'Yes') ?
    person.getIn(['ethnicity', 'ethnicity_detail', 'value']) : []
  return {hispanic_latino_origin, ethnicity_detail}
}

const getRaces = (person) => person.get('races', Map()).reduce((races, raceValue, raceKey) => {
  const raceDetails = person.getIn(['race_details', raceKey, 'value'], null)
  return (raceValue.get('value')) ? [...races, {race: raceKey, race_detail: raceDetails}] : races
}, [])

const csecPersonInfo = (person) => (
  person.getIn(['csec_types', 'value'], List()).map((type, index) => Map({
    id: person.getIn(['csec_ids', index]),
    participant_id: person.get('id'),
    csec_code_id: type,
    start_date: person.getIn(['csec_started_at', 'value']),
    end_date: person.getIn(['csec_ended_at', 'value']),
  }))
)

const selectAllReadOnlyAddresses = (state) => selectParticipants(state)
  .map((participant) => Map({
    personId: participant.get('id'),
    addresses: participant.get('addresses').filter(isReadOnly),
  }))

const combineAddresses = (person, personId, readOnlyAddressMap) => {
  const personAddress = readOnlyAddressMap.find((addrs) => addrs.get('personId') === personId)
  const readOnlyAddresses = personAddress ? personAddress.get('addresses') : List()
  return selectAddresses(person).concat(readOnlyAddresses).map(toFerbAddress)
}

export const getPeopleWithEditsSelector = createSelector(
  getPeopleSelector,
  getScreeningIdValueSelector,
  selectAllReadOnlyAddresses,
  (people, screeningId, readOnlyAddressMap) => people.map((person, personId) => {
    const isAgeDisabled = Boolean(person.getIn(['date_of_birth', 'value']))
    return fromJS({screening_id: screeningId,
      id: personId,
      approximate_age: isAgeDisabled ? null : person.getIn(['approximate_age', 'value']),
      approximate_age_units: isAgeDisabled ? null : person.getIn(['approximate_age_units', 'value']),
      csec: csecPersonInfo(person),
      date_of_birth: person.getIn(['date_of_birth', 'value']),
      date_of_death: person.getIn(['date_of_death', 'value']),
      first_name: person.getIn(['first_name', 'value']),
      gender: person.getIn(['gender', 'value']),
      languages: person.getIn(['languages', 'value']),
      legacy_descriptor: person.getIn(['legacy_descriptor', 'value']),
      middle_name: person.getIn(['middle_name', 'value']),
      last_name: person.getIn(['last_name', 'value']),
      name_suffix: person.getIn(['name_suffix', 'value']),
      phone_numbers: getPhoneNumbers(person),
      addresses: combineAddresses(person, personId, readOnlyAddressMap),
      roles: person.getIn(['roles', 'value']),
      ssn: person.getIn(['ssn', 'value']),
      sensitive: person.getIn(['sensitive', 'value']),
      sealed: person.getIn(['sealed', 'value']),
      probation_youth: person.getIn(['probation_youth', 'value']),
      ethnicity: getEthnicity(person),
      races: getRaces(person)})
  })
)

export const getPersonWithEditsSelector = (state, personId) => {
  const people = getPeopleWithEditsSelector(state)
  const person = people.get(personId)
  const reportType = getReportType(state)

  if (!person) { return null }

  const ssb = state.getIn(['safelySurrenderedBaby', 'form'])

  if (ssb && reportType === 'ssb' && ssb.get('participant_child') === personId) {
    return person.set('safely_surrendered_babies', ssb)
  }

  return person
}

const getAlertMessageByRole = (roles) => {
  if (roles.includes('Victim')) {
    return 'Alleged victims must be identified with a name, even Doe or Unknown, and must be under the age of 18'
  }
  return undefined
}

export const getPersonAlertErrorMessageSelector = (state, personId) => {
  const required = getNamesRequiredSelector(state, personId)
  const lastName = state.getIn(['peopleForm', personId, 'last_name', 'value'])
  const firstName = state.getIn(['peopleForm', personId, 'first_name', 'value'])
  const roles = state.getIn(['peopleForm', personId, 'roles', 'value'], List())
  if (required && !(firstName && lastName)) {
    return getAlertMessageByRole(roles)
  }
  return undefined
}

export const getFilteredPersonRolesSelector = (state, personId) => {
  const selectedRoles = state.getIn(['peopleForm', personId, 'roles', 'value'], List())
  const hasReporterRole = hasReporter(selectedRoles)
  return fromJS([
    ...ROLE_TYPE_NON_REPORTER.map((value) => ({label: value, value, disabled: false})),
    ...ROLE_TYPE_REPORTER.map((value) => ({label: value, value, disabled: hasReporterRole})),
  ])
}
