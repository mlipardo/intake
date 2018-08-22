import {fromJS} from 'immutable'
import {
  selectCandidateSelector,
} from 'selectors/screening/candidateSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('candidateSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  const emptyState = fromJS({relationships: []})

  describe('selectCandidateSelector', () => {
    it('returns a list of candidates or an empty list if there are no people', () => {
      const relationships = [
        {
          id: '1',
          date_of_birth: '1986-01-15',
          legacy_id: '3',
          first_name: 'Ricky',
          gender: 'M',
          last_name: 'Robinson',
          age: 20,
          age_unit: 'Y',
          relationships: [],
          candidate_to: [
            {
              candidate_id: '4157',
              candidate_first_name: 'New York',
              candidate_last_name: 'Pechan',
              candidate_middle_name: 'C',
              candidate_name_suffix: 'Sr.',
              candidate_gender: 'M',
              candidate_date_of_birth: '1958-11-11',
              candidate_age: 30,
              candidate_age_unit: 'Y',
            },
            {
              candidate_id: '4158',
              candidate_first_name: 'Walter',
              candidate_last_name: 'White',
              candidate_middle_name: 'A',
              candidate_name_suffix: 'Sr.',
              candidate_gender: 'M',
              candidate_date_of_birth: '1968-11-11',
              candidate_age: 40,
              candidate_age_unit: 'Y',
            },
          ],
        },
      ]

      const state = fromJS({relationships})
      const personId = '1'
      expect(selectCandidateSelector(state, personId)).toEqualImmutable(fromJS([
        {
          person: {
            dateOfBirth: '01/15/1986',
            legacyId: '3',
            name: 'Ricky Robinson',
            gender: 'M',
            age: '20 yrs',
          },
          candidate:
            {
              candidateId: '4157',
              name: 'New York C Pechan, Sr',
              gender: 'M',
              dateOfBirth: '11/11/1958',
              age: '30 yrs',
            },
        },
        {
          person: {
            dateOfBirth: '01/15/1986',
            legacyId: '3',
            name: 'Ricky Robinson',
            gender: 'M',
            age: '20 yrs',
          },
          candidate: {
            candidateId: '4158',
            name: 'Walter A White, Sr',
            gender: 'M',
            dateOfBirth: '11/11/1968',
            age: '40 yrs',
          },
        }]))
      expect(selectCandidateSelector(emptyState)).toEqualImmutable(fromJS([]))
    })
  })
})
