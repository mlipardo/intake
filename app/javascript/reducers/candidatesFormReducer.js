import {ageFormatter} from 'utils/ageFormatter'
import {createReducer} from 'utils/createReducer'
import {dateFormatter} from 'utils/dateFormatter'
import {FETCH_RELATIONSHIPS_COMPLETE} from 'actions/actionTypes'
import {fromJS, List, Map} from 'immutable'
import {genderMap} from 'selectors/screening/relationshipsSelectors'
import {
  RESET_CANDIDATE_FORM_FIELD,
  SET_CANDIDATE_FORM_FIELD,
} from 'actions/relationshipsActions'
import nameFormatter from 'utils/nameFormatter'
import {Maybe} from 'utils/maybe'

const selectPerson = (person) => (Map({
  age: ageFormatter({
    age: person.get('age'),
    ageUnit: person.get('age_unit'),
  }),
  dateOfBirth: dateFormatter(person.get('date_of_birth')),
  gender: genderMap(person.get('gender')),
  id: person.get('id'),
  legacyId: person.get('legacy_id'),
  name: nameFormatter({...person.toJS()}),
}))

const selectCandidate = (candidate) => (Map({
  age: ageFormatter({
    age: candidate.get('candidate_age'),
    ageUnit: candidate.get('candidate_age_unit'),
  }),
  id: candidate.get('candidate_id'),
  dateOfBirth: dateFormatter(candidate.get('candidate_date_of_birth')),
  gender: genderMap(candidate.get('candidate_gender')),
  name: nameFormatter({
    first_name: candidate.get('candidate_first_name'),
    last_name: candidate.get('candidate_last_name'),
    middle_name: candidate.get('candidate_middle_name'),
    name_suffix: candidate.get('candidate_name_suffix'),
  }),
}))

const buildCandidate = (people) =>
  people.get('candidate_to', List()).map((candidate) => Map({
    person: selectPerson(people),
    candidate: selectCandidate(candidate),
  }))

const buildCandidates = (relationships) =>
  relationships.reduce((candidates, people) => (
    candidates.set(people.get('id'), buildCandidate(people))
  ), Map())

const loadCandidates = (state, {payload: {relationships}, error}) => {
  if (error) {
    return state
  } else {
    const candidates = buildCandidates(fromJS((relationships)))
    return candidates
  }
}

const removeRelationshipType = (candidates) => (
  candidates.map((relationship) =>
    relationship.set('candidate', relationship.get('candidate').delete('relationshipType'))
  )
)

const resetCandidates = (state, {payload: {id}}) =>
  state.update(id, removeRelationshipType).delete('isDisabled')

const checkRelationshipType = (candidate) =>
  Maybe.of(candidate.getIn(['candidate', 'relationshipType'])).isSomething() &&
  candidate.getIn(['candidate', 'relationshipType']) !== ''

const updateCandidateForm = (state, {payload: {personId, candidateId, fieldSet, value}}) => {
  const index = state.get(personId).findIndex(
    (relatee) => relatee.getIn(['candidate', 'id']) === candidateId
  )
  const updatedForm = state.setIn([personId, index, 'candidate', fieldSet], value)
  const relationshipTypeExists = updatedForm.getIn([personId]).some(checkRelationshipType)
  return (relationshipTypeExists) ? updatedForm.set('isDisabled', false) : updatedForm.set('isDisabled', true)
}

export default createReducer(Map(), {
  [FETCH_RELATIONSHIPS_COMPLETE]: loadCandidates,
  [RESET_CANDIDATE_FORM_FIELD]: resetCandidates,
  [SET_CANDIDATE_FORM_FIELD]: updateCandidateForm,
})
