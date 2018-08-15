import {createSelector} from 'reselect'
import {Map, List} from 'immutable'
import nameFormatter from 'utils/nameFormatter'
import {dateFormatter} from 'utils/dateFormatter'
import {ageFormatter} from 'utils/ageFormatter'

export const getScreeningCandidates = (state) => (state.get('relationships', List()))

export const getCandidateSelector = createSelector(
  getScreeningCandidates,
  (people) => people.map((person) => Map({
    dateOfBirth: dateFormatter(person.get('date_of_birth')),
    legacy_id: person.get('legacy_id'),
    name: nameFormatter({...person.toJS()}),
    gender: person.get('gender') || '',
    age: ageFormatter({
      age: person.get('age'),
      ageUnit: person.get('age_unit'),
    }),
    candidate_to: person.get('candidate_to', List()).map((candidate) => (
      Map({
        candidate_id: candidate.get('candidate_id'),
        name: nameFormatter({
          first_name: candidate.get('candidate_first_name'),
          last_name: candidate.get('candidate_last_name'),
          middle_name: candidate.get('candidate_middle_name'),
          name_suffix: candidate.get('candidate_name_suffix'),
        }),
        gender: candidate.get('candidate_gender'),
        dateOfBirth: dateFormatter(candidate.get('candidate_date_of_birth')),
        age: ageFormatter({
          age: candidate.get('candidate_age'),
          ageUnit: candidate.get('candidate_age_unit'),
        }),
      })
    )),
  }))
)
