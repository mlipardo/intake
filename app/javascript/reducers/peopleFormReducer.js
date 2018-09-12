import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'
import {FETCH_SCREENING_COMPLETE} from 'actions/actionTypes'
import {
  SET_PEOPLE_FORM_FIELD,
  TOUCH_PEOPLE_FORM_FIELD,
  SET_PEOPLE_ADDRESS_FORM_FIELD,
  TOUCH_PEOPLE_ADDRESS_FORM_FIELD,
  ADD_PEOPLE_FORM_ADDRESS,
  DELETE_PEOPLE_FORM_ADDRESS,
  ADD_PEOPLE_FORM_PHONE_NUMBER,
  DELETE_PEOPLE_FORM_PHONE_NUMBER,
  TOUCH_ALL_PEOPLE_FORM_FIELDS,
} from 'actions/peopleFormActions'
import {
  CREATE_PERSON_COMPLETE,
  UPDATE_PERSON_COMPLETE,
} from 'actions/personCardActions'
import {fromFerbAddress, setTouchable, isReadWrite} from 'data/address'

const buildAddresses = (addresses) => fromJS(addresses || [])
  .map(fromFerbAddress)
  .map(setTouchable)
  .filter(isReadWrite)

const buildPhoneNumbers = (phoneNumbers) => {
  if (phoneNumbers) {
    return phoneNumbers.map(({id, number, type}) => ({
      id,
      number: {value: number},
      type: {value: type},
    }))
  } else {
    return []
  }
}
const buildRaces = (races = []) => races.reduce((racesValue, {race}) => ({
  ...racesValue,
  [race]: {value: true},
}), {})
const buildRaceDetails = (races = []) => races.reduce((racesValue, {race, race_detail}) => ({
  ...racesValue,
  [race]: {value: race_detail},
}), {})

const buildEthnicity = (ethnicity = {}) => {
  const {hispanic_latino_origin = null, ethnicity_detail = []} = ethnicity
  return {
    hispanic_latino_origin: {value: hispanic_latino_origin},
    ethnicity_detail: {value: ethnicity_detail},
  }
}

const buildCsecDates = (csec) => {
  const firstCsec = csec && csec[0]
  return {
    csec_started_at: {value: firstCsec ? firstCsec.start_date || '' : '', touched: false},
    csec_ended_at: {value: firstCsec ? firstCsec.end_date || '' : '', touched: false},
  }
}

const buildCsec = (csec) => ({
  csec_ids: csec ? csec.map((entry) => entry.id) : [],
  csec_types: {
    value: csec ? csec.reduce((result, entry) => {
      result.push(entry.csec_code_id); return result
    }, []
    ) : [],
    touched: false,
  },
  ...buildCsecDates(csec),
})

const buildPerson = ({
  addresses,
  approximate_age,
  approximate_age_units,
  csec,
  date_of_birth,
  date_of_death,
  first_name,
  gender,
  languages,
  last_name,
  legacy_descriptor,
  middle_name,
  name_suffix,
  phone_numbers,
  roles,
  ssn,
  sensitive,
  sealed,
  probation_youth,
  races,
  ethnicity,
}) => fromJS({
  addresses: buildAddresses(addresses),
  approximate_age: {value: approximate_age},
  approximate_age_units: {value: approximate_age_units},
  date_of_birth: {value: date_of_birth},
  date_of_death: {value: date_of_death},
  first_name: {value: first_name, touched: false},
  gender: {value: gender},
  languages: {value: languages},
  last_name: {value: last_name, touched: false},
  legacy_descriptor: {value: legacy_descriptor || {}},
  middle_name: {value: middle_name},
  name_suffix: {value: name_suffix},
  phone_numbers: buildPhoneNumbers(phone_numbers),
  roles: {value: roles, touched: false},
  ssn: {value: ssn, touched: false},
  sensitive: {value: sensitive},
  sealed: {value: sealed},
  probation_youth: {value: probation_youth},
  races: buildRaces(races),
  race_details: buildRaceDetails(races),
  ethnicity: buildEthnicity(ethnicity),
  ...buildCsec(csec),
})

const loadPeopleFormPerson = (state, {payload: {person}, error}) => {
  if (error) {
    return state
  }
  return state.set(person.id, buildPerson(person))
}

const updatePeopleFormPerson = (state, {payload: {person}, error}) => {
  if (error) {
    return state
  }

  const prevPerson = state.get(person.id, Map())
  const newPerson = buildPerson(person)

  return state.set(
    person.id,
    newPerson
      .setIn(['roles', 'touched'], prevPerson.getIn(['roles', 'touched'], false))
      .setIn(['csec_types', 'touched'], prevPerson.getIn(['csec_types', 'touched'], false))
      .setIn(['csec_started_at', 'touched'], prevPerson.getIn(['csec_started_at', 'touched'], false))
      .setIn(['csec_ended_at', 'touched'], prevPerson.getIn(['csec_ended_at', 'touched'], false))
      .setIn(['first_name', 'touched'], prevPerson.getIn(['first_name', 'touched'], false))
      .setIn(['last_name', 'touched'], prevPerson.getIn(['last_name', 'touched'], false))
      .setIn(['ssn', 'touched'], prevPerson.getIn(['ssn', 'touched'], false))
  )
}

export default createReducer(Map(), {
  [CREATE_PERSON_COMPLETE]: loadPeopleFormPerson,
  [UPDATE_PERSON_COMPLETE]: updatePeopleFormPerson,
  [FETCH_SCREENING_COMPLETE]: (state, {payload: {screening}, error}) => {
    if (error) {
      return state
    } else {
      return screening.participants.reduce((people, participant) => (
        people.set(participant.id, buildPerson(participant))
      ), Map())
    }
  },
  [SET_PEOPLE_FORM_FIELD]: (state, {payload: {personId, fieldSet, value}}) => state.setIn([personId, ...fieldSet, 'value'], fromJS(value)),
  [TOUCH_PEOPLE_FORM_FIELD]: (state, {payload: {personId, field}}) => state.setIn([personId, ...field, 'touched'], true),
  [SET_PEOPLE_ADDRESS_FORM_FIELD]: (state, {payload: {personId, addressIndex, field, value}}) =>
    state.setIn([personId, 'addresses', addressIndex, field], value),
  [TOUCH_PEOPLE_ADDRESS_FORM_FIELD]: (state, {payload: {personId, addressIndex, field}}) =>
    state.setIn([personId, 'addresses', addressIndex, 'touched', field], true),
  [TOUCH_ALL_PEOPLE_FORM_FIELDS]: (state, {payload: {personId}}) => {
    const fieldsWithTouch = [
      'roles',
      'first_name',
      'last_name',
      'ssn',
      'csec_types',
      'csec_started_at',
      'csec_ended_at',
    ]
    return fieldsWithTouch.reduce((newState, field) => newState.setIn([personId, field, 'touched'], true), state)
  },
  [ADD_PEOPLE_FORM_ADDRESS]: (state, {payload: {personId}}) => {
    const currentAddresses = state.getIn([personId, 'addresses'])
    const newAddress = setTouchable(fromFerbAddress(Map()))
    return state.setIn([personId, 'addresses'], currentAddresses.push(newAddress))
  },
  [ADD_PEOPLE_FORM_PHONE_NUMBER]: (state, {payload: {personId}}) => {
    const currentPhones = state.getIn([personId, 'phone_numbers'])
    const newPhone = fromJS({id: null, number: {value: null}, type: {value: null}})
    return state.setIn([personId, 'phone_numbers'], currentPhones.push(newPhone))
  },
  [DELETE_PEOPLE_FORM_ADDRESS]: (state, {payload: {personId, addressIndex}}) => {
    const currentAddresses = state.getIn([personId, 'addresses'])
    return state.setIn([personId, 'addresses'], currentAddresses.delete(addressIndex))
  },
  [DELETE_PEOPLE_FORM_PHONE_NUMBER]: (state, {payload: {personId, phoneIndex}}) => {
    const currentPhones = state.getIn([personId, 'phone_numbers'])
    return state.setIn([personId, 'phone_numbers'], currentPhones.delete(phoneIndex))
  },
})
