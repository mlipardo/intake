import * as matchers from 'jasmine-immutable-matchers'
import {fromJS} from 'immutable'
import relationshipsButtonReducer from 'reducers/relationshipsButtonReducer'
import {setCreateRelationButtonStatus} from 'actions/relationshipsActions'

describe('RelationshipsButtonReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))
  const state = {}
  const twoParticipants = [
    {
      id: 300,
      legacy_source_table: 'CLIENT_T',
      legacy_id: 'TNpcAOB0Hy',
      first_name: 'New York',
      last_name: 'Pechan',
      gender: 'male',
      ssn: '936-00-7730',
      date_of_birth: '2009-11-11',
      roles: [],
      addresses: [
        {
          messages: [],
          id: '77',
          type: 'Home',
          street_address: '2341234132 Orin Road',
          city: 'Livingston',
          state: 'CA',
          zip: '23452',
          legacy_descriptor: {
            legacy_id: '671OnqN0Hy',
            legacy_last_updated: '1999-09-01T09:46:02.214-0700',
            legacy_table_name: 'ADDRS_T',
            legacy_table_description: 'Address',
          },
        },
      ],
      races: [
        {
          race: 'Asian',
          race_detail: 'Japanese',
        },
      ],
      ethnicity: {
        hispanic_latino_origin: null,
        ethnicity_detail: [],
      },
      middle_name: 'C',
      name_suffix: 'Sr.',
      languages: [
        'Korean',
        'German',
      ],
      screening_id: 1,
      phone_numbers: [],
      sealed: false,
      sensitive: false,
      legacy_descriptor: {
        legacy_id: 'TNpcAOB0Hy',
        legacy_last_updated: '1999-09-02T16:51:07.769-0700',
        legacy_table_name: 'CLIENT_T',
        legacy_table_description: 'Client',
      },
      csec: [],
    },
    {
      id: 295,
      legacy_source_table: 'CLIENT_T',
      legacy_id: 'QamHhLg0JX',
      first_name: 'Mother',
      last_name: 'Bunny',
      gender: 'female',
      ssn: '868-00-3124',
      date_of_birth: '1960-04-04',
      roles: [],
      addresses: [],
      races: [],
      ethnicity: [],
      middle_name: '',
      name_suffix: '',
      languages: [
        'Spanish',
      ],
      screening_id: '1',
      phone_numbers: [],
      sealed: false,
      sensitive: false,
      legacy_descriptor: {
        legacy_id: 'QamHhLg0JX',
        legacy_last_updated: '2000-03-13T11:09:18.470-0800',
        legacy_table_name: 'CLIENT_T',
        legacy_table_description: 'Client',
      },
      csec: [],
    },
  ]

  const oneParticipant = [{
    id: 300,
    legacy_source_table: 'CLIENT_T',
    legacy_id: 'TNpcAOB0Hy',
    first_name: 'New York',
    last_name: 'Pechan',
    gender: 'male',
    ssn: '936-00-7730',
    date_of_birth: '2009-11-11',
    roles: [],
    addresses: [
      {
        messages: [],
        id: '77',
        type: 'Home',
        street_address: '2341234132 Orin Road',
        city: 'Livingston',
        state: 'CA',
        zip: '23452',
        legacy_descriptor: {
          legacy_id: '671OnqN0Hy',
          legacy_last_updated: '1999-09-01T09:46:02.214-0700',
          legacy_table_name: 'ADDRS_T',
          legacy_table_description: 'Address',
        },
      },
    ],
    races: [
      {
        race: 'Asian',
        race_detail: 'Japanese',
      },
    ],
    ethnicity: {
      hispanic_latino_origin: null,
      ethnicity_detail: [],
    },
    middle_name: 'C',
    name_suffix: 'Sr.',
    languages: [
      'Korean',
      'German',
    ],
    screening_id: 1,
    phone_numbers: [],
    sealed: false,
    sensitive: false,
    legacy_descriptor: {
      legacy_id: 'TNpcAOB0Hy',
      legacy_last_updated: '1999-09-02T16:51:07.769-0700',
      legacy_table_name: 'CLIENT_T',
      legacy_table_description: 'Client',
    },
    csec: [],
  }]

  describe('on SET_CREATE_RELATION_BTN_STATUS ', () => {
    it('it sets the value of createRelationshipsButtonStatus to true when there are more than one participant', () => {
      const action = setCreateRelationButtonStatus(twoParticipants)
      expect(relationshipsButtonReducer(state, action)).toEqualImmutable(fromJS({createRelationshipsButtonStatus: true}))
    })
    it('it sets the value of createRelationshipsButtonStatus to false when there is one participant', () => {
      const action = setCreateRelationButtonStatus(oneParticipant)
      expect(relationshipsButtonReducer(state, action)).toEqualImmutable(fromJS({createRelationshipsButtonStatus: false}))
    })
  })
})
