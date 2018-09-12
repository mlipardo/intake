import {fromJS} from 'immutable'
import {
  selectCandidates,
  selectCandidatesWithEdits,
} from 'selectors/screening/candidateSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('candidateSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  const candidatesForm = {
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
    2: [],
    3: [{
      person: {
        age: '30 yrs',
        dateOfBirth: '01/15/1986',
        id: '415',
        gender: 'Male',
        name: 'Son Goku',
      },
      candidate: {
        age: '21 yrs',
        dateOfBirth: '11/11/1958',
        id: '450',
        gender: 'Male',
        name: 'Son Gohan',
        relationshipType: '211',
      },
    }, {
      person: {
        age: '100 yrs',
        dateOfBirth: '01/15/1986',
        id: '789',
        gender: 'Unknown',
        legacyId: '3',
        name: 'Freeza',
      },
      candidate: {
        age: '200 yrs',
        dateOfBirth: '11/11/1968',
        id: '4158',
        gender: 'Unknown',
        name: 'Majin Boo',
        relationshipType: '271',
      },
    }],
    4: [{
      person: {
        age: '32 yrs',
        dateOfBirth: '01/15/1986',
        id: '5786',
        gender: 'Male',
        name: 'Vegeta',
      },
      candidate: {
        age: '21 yrs',
        dateOfBirth: '11/11/1997',
        id: '852',
        gender: 'Male',
        name: 'Son Gohan',
        relationshipType: '296',
      },
    }, {
      person: {
        age: '32 yrs',
        dateOfBirth: '01/15/1986',
        id: '5786',
        gender: 'Male',
        name: 'Vegeta',
      },
      candidate: {
        age: '500 yrs',
        dateOfBirth: '11/11/1968',
        id: '788',
        gender: 'Unknown',
        name: 'Jiren',
        relationshipType: null,
      },
    }, {
      person: {
        age: '32 yrs',
        dateOfBirth: '01/15/1986',
        id: '5786',
        gender: 'Male',
        name: 'Vegeta',
      },
      candidate: {
        age: '200 yrs',
        dateOfBirth: '01/04/1600',
        id: '1111',
        gender: 'Unknown',
        name: 'Hitman',
        relationshipType: '',
      },
    }],
  }
  describe('selectCandidates', () => {
    it('returns a list of candidates', () => {
      const id = '1'
      const state = fromJS({candidatesForm})
      expect(selectCandidates(state, id)).toEqualImmutable(fromJS([{
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
      }]))
    })

    it('returns an empty List when candidates are empty', () => {
      const id = '2'
      const state = fromJS({candidatesForm})
      expect(selectCandidates(state, id)).toEqualImmutable(fromJS([]))
    })
  })

  describe('selectCandidatesWithEdits', () => {
    it('returns an array of relationship formatted to post batch', () => {
      const id = '3'
      const state = fromJS({candidatesForm})
      expect(selectCandidatesWithEdits(state, id)).toEqualImmutable(fromJS({
        relationships: [{
          client_id: '415',
          relative_id: '450',
          relationship_type: 211,
          absent_parent_indicator: false,
          same_home_status: 'N',
        }, {
          client_id: '789',
          relative_id: '4158',
          relationship_type: 271,
          absent_parent_indicator: false,
          same_home_status: 'N',
        }]}))
    })

    it('returns an empty List when candidates are empty', () => {
      const id = '2'
      const state = fromJS({candidatesForm})
      expect(
        selectCandidatesWithEdits(state, id)).toEqualImmutable(fromJS({relationships: []})
      )
    })

    it('removes a candidate when the relationship value is null or empty string', () => {
      const id = '4'
      const state = fromJS({candidatesForm})
      expect(selectCandidatesWithEdits(state, id)).toEqualImmutable(fromJS({
        relationships: [{
          client_id: '5786',
          relative_id: '852',
          relationship_type: 296,
          absent_parent_indicator: false,
          same_home_status: 'N',
        }]}))
    })
  })
})
