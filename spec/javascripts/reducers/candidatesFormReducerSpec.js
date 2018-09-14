import * as matchers from 'jasmine-immutable-matchers'
import candidatesReducer from 'reducers/candidatesFormReducer'
import {
  fetchRelationshipsSuccess,
  setFieldCandidate,
  resetFieldCandidate,
} from 'actions/relationshipsActions'
import {Map, fromJS} from 'immutable'

describe('candidatesFormReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))
  const relationships = [{
    id: '1',
    date_of_birth: '1986-01-15',
    legacy_id: '3',
    first_name: 'Ricky',
    gender: 'M',
    last_name: 'Robinson',
    age: 20,
    age_unit: 'Y',
    relationships: [],
    candidate_to: [{
      candidate_id: '4157',
      candidate_first_name: 'New York',
      candidate_last_name: 'Pechan',
      candidate_middle_name: 'C',
      candidate_name_suffix: 'Sr.',
      candidate_gender: 'M',
      candidate_date_of_birth: '1958-11-11',
      candidate_age: 30,
      candidate_age_unit: 'Y',
    }, {
      candidate_id: '4158',
      candidate_first_name: 'Walter',
      candidate_last_name: 'White',
      candidate_middle_name: 'A',
      candidate_name_suffix: 'Sr.',
      candidate_gender: 'M',
      candidate_date_of_birth: '1968-11-11',
      candidate_age: 40,
      candidate_age_unit: 'Y',
    }],
  }]

  describe('on FETCH_RELATIONSHIPS_COMPLETE', () => {
    it('returns only isDisabled field', () => {
      expect(
        candidatesReducer(Map(), fetchRelationshipsSuccess([]))
      ).toEqualImmutable(Map({}))
    })

    it('returns candidates for relationships', () => {
      const action = fetchRelationshipsSuccess(relationships)

      expect(candidatesReducer(Map(), action)).toEqualImmutable(
        fromJS({
          1: [{
            person: {
              age: '20 yrs',
              dateOfBirth: '01/15/1986',
              id: '1',
              gender: 'Male',
              legacyId: '3',
              name: 'Ricky Robinson',
            },
            candidate: {
              age: '30 yrs',
              dateOfBirth: '11/11/1958',
              id: '4157',
              gender: 'Male',
              name: 'New York C Pechan, Sr',
            },
          }, {
            person: {
              age: '20 yrs',
              dateOfBirth: '01/15/1986',
              id: '1',
              gender: 'Male',
              legacyId: '3',
              name: 'Ricky Robinson',
            },
            candidate: {
              age: '40 yrs',
              dateOfBirth: '11/11/1968',
              id: '4158',
              gender: 'Male',
              name: 'Walter A White, Sr',
            },
          }],
        })
      )
    })
  })

  describe('on SET_CANDIDATE_FORM_FIELD', () => {
    it('returns candidates updates relationship Type', () => {
      const personId = '1'
      const candidateId = '4157'
      const fieldSet = 'relationshipType'
      const value = '190'
      const candidateForm = {
        1: [{
          person: {
            age: '20 yrs',
            dateOfBirth: '01/15/1986',
            id: '1',
            gender: 'Male',
            legacyId: '3',
            name: 'Ricky Robinson',
          },
          candidate: {
            age: '30 yrs',
            dateOfBirth: '11/11/1958',
            id: '4157',
            gender: 'Male',
            name: 'New York C Pechan, Sr',
          },
        }, {
          person: {
            age: '20 yrs',
            dateOfBirth: '01/15/1986',
            id: '1',
            gender: 'Male',
            legacyId: '3',
            name: 'Ricky Robinson',
          },
          candidate: {
            age: '40 yrs',
            dateOfBirth: '11/11/1968',
            id: '4158',
            gender: 'Male',
            name: 'Walter A White, Sr',
          },
        }],
      }
      const action = setFieldCandidate(personId, candidateId, fieldSet, value)
      const state = fromJS(candidateForm)
      expect(candidatesReducer(state, action)).toEqualImmutable(
        fromJS({
          1: [{
            person: {
              age: '20 yrs',
              dateOfBirth: '01/15/1986',
              id: '1',
              gender: 'Male',
              legacyId: '3',
              name: 'Ricky Robinson',
            },
            candidate: {
              age: '30 yrs',
              dateOfBirth: '11/11/1958',
              id: '4157',
              gender: 'Male',
              name: 'New York C Pechan, Sr',
              relationshipType: '190',
            },
          }, {
            person: {
              age: '20 yrs',
              dateOfBirth: '01/15/1986',
              id: '1',
              gender: 'Male',
              legacyId: '3',
              name: 'Ricky Robinson',
            },
            candidate: {
              age: '40 yrs',
              dateOfBirth: '11/11/1968',
              id: '4158',
              gender: 'Male',
              name: 'Walter A White, Sr',
            },
          }],
          isDisabled: false,
        })
      )
    })
  })

  describe('SET_CANDIDATE_FORM_FIELD', () => {
    it('sets isDisabled to true if relationshipType is set to empty value', () => {
      const personId = '1'
      const candidateId = '4157'
      const fieldSet = 'relationshipType'
      const value = ''
      const candidateForm = {
        1: [{
          person: {
            age: '20 yrs',
            dateOfBirth: '01/15/1986',
            id: '1',
            gender: 'Male',
            legacyId: '3',
            name: 'Ricky Robinson',
          },
          candidate: {
            age: '30 yrs',
            dateOfBirth: '11/11/1958',
            id: '4157',
            gender: 'Male',
            name: 'New York C Pechan, Sr',
            relationshipType: '200',
          },
        }, {
          person: {
            age: '20 yrs',
            dateOfBirth: '01/15/1986',
            id: '1',
            gender: 'Male',
            legacyId: '3',
            name: 'Ricky Robinson',
          },
          candidate: {
            age: '40 yrs',
            dateOfBirth: '11/11/1968',
            id: '4158',
            gender: 'Male',
            name: 'Walter A White, Sr',
          },
        }],
        isDisabled: false,
      }
      const action = setFieldCandidate(personId, candidateId, fieldSet, value)
      const state = fromJS(candidateForm)
      expect(candidatesReducer(state, action)).toEqualImmutable(
        fromJS({
          1: [{
            person: {
              age: '20 yrs',
              dateOfBirth: '01/15/1986',
              id: '1',
              gender: 'Male',
              legacyId: '3',
              name: 'Ricky Robinson',
            },
            candidate: {
              age: '30 yrs',
              dateOfBirth: '11/11/1958',
              id: '4157',
              gender: 'Male',
              name: 'New York C Pechan, Sr',
              relationshipType: '',
            },
          }, {
            person: {
              age: '20 yrs',
              dateOfBirth: '01/15/1986',
              id: '1',
              gender: 'Male',
              legacyId: '3',
              name: 'Ricky Robinson',
            },
            candidate: {
              age: '40 yrs',
              dateOfBirth: '11/11/1968',
              id: '4158',
              gender: 'Male',
              name: 'Walter A White, Sr',
            },
          }],
          isDisabled: true,
        })
      )
    })
  })

  describe('on RESET_CANDIDATE_FORM_FIELD', () => {
    it('returns candidates removing the relationshipType', () => {
      const personId = '1'
      const candidateForm = {
        1: [{
          person: {
            age: '20 yrs',
            dateOfBirth: '01/15/1986',
            id: '1',
            gender: 'Male',
            legacyId: '3',
            name: 'Ricky Robinson',
          },
          candidate: {
            age: '30 yrs',
            dateOfBirth: '11/11/1958',
            id: '4157',
            gender: 'Male',
            name: 'New York C Pechan, Sr',
            relationshipType: '191',
          },
        }, {
          person: {
            age: '20 yrs',
            dateOfBirth: '01/15/1986',
            id: '1',
            gender: 'Male',
            legacyId: '3',
            name: 'Ricky Robinson',
          },
          candidate: {
            age: '40 yrs',
            dateOfBirth: '11/11/1968',
            id: '4158',
            gender: 'Male',
            name: 'Walter A White, Sr',
            relationshipType: '200',
          },
        }],
      }
      const action = resetFieldCandidate(personId)
      const state = fromJS(candidateForm)
      expect(candidatesReducer(state, action)).toEqualImmutable(
        fromJS({
          1: [{
            person: {
              age: '20 yrs',
              dateOfBirth: '01/15/1986',
              id: '1',
              gender: 'Male',
              legacyId: '3',
              name: 'Ricky Robinson',
            },
            candidate: {
              age: '30 yrs',
              dateOfBirth: '11/11/1958',
              id: '4157',
              gender: 'Male',
              name: 'New York C Pechan, Sr',
            },
          }, {
            person: {
              age: '20 yrs',
              dateOfBirth: '01/15/1986',
              id: '1',
              gender: 'Male',
              legacyId: '3',
              name: 'Ricky Robinson',
            },
            candidate: {
              age: '40 yrs',
              dateOfBirth: '11/11/1968',
              id: '4158',
              gender: 'Male',
              name: 'Walter A White, Sr',
            },
          }],
        })
      )
    })
  })
})
