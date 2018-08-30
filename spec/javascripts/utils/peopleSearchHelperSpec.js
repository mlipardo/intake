import * as matchers from 'jasmine-immutable-matchers'
import {fromJS} from 'immutable'
import {
  mapDoraPersonToParticipant,
  mapLanguages,
  mapRaces,
  mapEthnicities,
  mapIsSensitive,
  mapIsSealed,
  mapPhoneNumber,
  mapAddress,
} from 'utils/peopleSearchHelper'
import {RESIDENCE_TYPE} from 'enums/AddressType'

describe('peopleSearchHelper', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  const languages = [
    {code: '1', value: 'English'},
    {code: '2', value: 'French'},
    {code: '3', value: 'Italian'},
  ]
  const ethnicityTypes = [
    {code: '1', value: 'European'},
    {code: '2', value: 'French'},
    {code: '3', value: 'Romanian'},
  ]
  const raceTypes = [
    {code: '1', value: 'Race 1'},
    {code: '2', value: 'Race 2'},
    {code: '3', value: 'Race 3'},
  ]
  const unableToDetermineCodes = [
    {code: 'A', value: 'Abandoned'},
    {code: 'I', value: 'Unknown'},
    {code: 'K', value: 'Unknown'},
  ]
  const hispanicOriginCodes = [
    {code: 'Y', value: 'yes'},
    {code: 'N', value: 'no'},
  ]

  const addressTypes = [{code: RESIDENCE_TYPE, value: 'address type'}]

  const systemCodes = {
    addressTypes,
    ethnicityTypes,
    hispanicOriginCodes,
    languages,
    raceTypes,
    unableToDetermineCodes,
  }

  describe('mapDoraPersonToParticipant', () => {
    it('maps all fields', () => {
      const doraPerson = {
        race_ethnicity: {
          hispanic_origin_code: 'N',
          unable_to_determine_code: '',
          race_codes: [{id: '1'}],
          hispanic_codes: [],
          hispanic_unable_to_determine_code: '',
        },
        addresses: [{
          zip: '99999',
          city: 'Al Haad',
          type: {id: RESIDENCE_TYPE},
          street_name: 'Canary Alley',
          state_name: 'California',
          street_number: '15',
          effective_start_date: '1997-09-04',
          id: 'NuzhtHm083',
          state: {id: '1828'},
          state_code: 'CA',
          zip_4: '1111',
          phone_numbers: [{number: '9660007290'}],
        }],
        gender: 'male',
        languages: [{
          id: '2',
          primary: true,
        }, {
          id: '1',
          primary: false,
        }],
        date_of_birth: '1994-09-29',
        date_of_death: '1996-09-21',
        legacy_descriptor: {
          legacy_id: 'OkMXEhe083',
          legacy_ui_id: '1673-3395-1268-0001926',
          legacy_last_updated: '2004-11-16T17:25:53.407-0800',
          legacy_table_name: 'PLC_HM_T',
          legacy_table_description: 'Placement Home',
        },
        last_name: 'John',
        middle_name: '',
        name_suffix: 'jr',
        ssn: '996005129',
        phone_numbers: [{number: '9660007290'}],
        id: 'OkMXEhe083',
        first_name: 'Mohammed',
        sensitivity_indicator: 'N',
      }
      const participant = {
        date_of_birth: '1994-09-29',
        date_of_death: '1996-09-21',
        probation_youth: false,
        approximate_age: null,
        approximate_age_units: null,
        first_name:	'Mohammed',
        gender: 'male',
        middle_name: '',
        last_name: 'John',
        ssn: '996005129',
        sealed: false,
        sensitive: false,
        legacy_descriptor: {
          legacy_id: 'OkMXEhe083',
          legacy_ui_id: '1673-3395-1268-0001926',
          legacy_last_updated: '2004-11-16T17:25:53.407-0800',
          legacy_table_name: 'PLC_HM_T',
          legacy_table_description: 'Placement Home',
        },
        phone_numbers: [{number: '9660007290'}],
        name_suffix: 'jr',
        addresses: [{
          city: 'Al Haad',
          state: 'CA',
          street_address: '15 Canary Alley',
          zip: '99999',
          type: 'address type',
        }],
        id: 'OkMXEhe083',
        legacy_id: 'OkMXEhe083',
        roles: [],
        languages: ['French', 'English'],
        races: [{
          race: 'Race 1',
          race_detail: 'European',
        }],
        ethnicity: {
          hispanic_latino_origin: 'no',
          ethnicity_detail: [],
        },
      }

      const state = fromJS({systemCodes})

      const result = mapDoraPersonToParticipant(state, fromJS(doraPerson))

      fromJS(participant).forEach((value, key) =>
        expect(result.get(key)).toEqualImmutable(value)
      )
      expect(result).toEqualImmutable(fromJS(participant))
    })
  })

  describe('mapLanguages', () => {
    it('maps languages to lov values by id, sorting by primary', () => {
      const result = fromJS({
        languages: [
          {id: '3', primary: true}, // Italian
          {id: '2', primary: false}, // French
          {id: '1', primary: true}], // English
      })
      const state = fromJS({systemCodes: {languages}})
      const languageResult = mapLanguages(state, result)
      expect(languageResult).toEqualImmutable(
        fromJS(['Italian', 'English', 'French'])
      )
    })
  })

  describe('mapIsSensitive', () => {
    it('returns true if the result is sensitive', () => {
      const result = fromJS({
        sensitivity_indicator: 'S',
      })
      const sensitiveResult = mapIsSensitive(result)
      expect(sensitiveResult).toEqual(true)
    })

    it('returns false if the result is not sensitive', () => {
      const result = fromJS({
        sensitivity_indicator: 'R',
      })
      const sensitiveResult = mapIsSensitive(result)
      expect(sensitiveResult).toEqual(false)
    })
  })

  describe('mapIsSealed', () => {
    it('returns true if the result is sealed', () => {
      const result = fromJS({
        sensitivity_indicator: 'R',
      })
      const sensitiveResult = mapIsSealed(result)
      expect(sensitiveResult).toEqual(true)
    })

    it('returns false if the result is not sealed', () => {
      const result = fromJS({
        sensitivity_indicator: 'S',
      })
      const sensitiveResult = mapIsSealed(result)
      expect(sensitiveResult).toEqual(false)
    })
  })

  describe('mapPhoneNumber', () => {
    it('returns phone numbers', () => {
      const result = fromJS({
        addresses: [{
          id: 'TSWY42i0V4',
          city: 'Sacramento',
          state: {
            id: '1828',
            description: 'California',
          },
          state_code: 'CA',
          state_name: 'California',
          county: {
            id: '1101',
            description: 'Sacramento',
          },
          zip: null,
          type: {
            id: '32',
            description: 'Residence',
          },
          street_number: '10',
          street_name: 'Main St',
          active: 'true',
          legacy_descriptor: {
            legacy_id: 'TSWY42i0V4',
            legacy_ui_id: '1673-3395-1268-0001926',
            legacy_last_updated: '2004-11-16T17:25:53.407-0800',
            legacy_table_name: 'PLC_HM_T',
            legacy_table_description: 'Placement Home',
          },
          phone_numbers: [
            {
              number: '9200002665',
              type: 'Home',
            },
            {
              number: '9230003403',
              type: 'Work',
            },
            {
              number: '8720007345',
              type: 'Cell',
            },
          ],
        }],
      })
      expect(mapPhoneNumber(result)).toEqualImmutable(fromJS([
        {number: '9200002665', type: 'Home'},
        {number: '9230003403', type: 'Work'},
        {number: '8720007345', type: 'Cell'},
      ]))
    })
  })

  describe('mapAddress', () => {
    it('returns the city, state, zip, type, and a joined street address', () => {
      const result = fromJS({
        addresses: [{
          city: 'city',
          state_code: 'state',
          zip: 'zip',
          type: {id: RESIDENCE_TYPE},
          street_number: '123',
          street_name: 'C Street',

        }],
      })
      const state = fromJS({systemCodes})
      const addressResult = mapAddress(state, result)
      expect(addressResult).toEqualImmutable(fromJS({
        city: 'city',
        state: 'state',
        zip: 'zip',
        type: 'address type',
        streetAddress: '123 C Street',
      }))
    })

    it('returns null list when typeId is not 32', () => {
      const result = fromJS({
        addresses: [{
          city: 'city',
          state_code: 'state',
          zip: 'zip',
          type: {id: '5'},
          street_number: '123',
          street_name: 'C Street',

        }],
      })
      const state = fromJS({systemCodes})
      const addressResult = mapAddress(state, result)
      expect(addressResult).toEqual(null)
    })

    it('returns the first address from addresses object', () => {
      const result = fromJS({
        addresses: [{
          city: 'city',
          state_code: 'state',
          zip: 'zip',
          type: {id: RESIDENCE_TYPE},
          street_number: '123',
          street_name: 'C Street',
        }, {
          city: 'city2',
          state_code: 'state2',
          zip: 'zip2',
          type: {id: RESIDENCE_TYPE},
          street_number: '12345',
          street_name: 'K Street',
        }],
      })
      const state = fromJS({systemCodes})
      const addressResult = mapAddress(state, result)
      expect(addressResult).toEqualImmutable(fromJS({
        city: 'city',
        state: 'state',
        zip: 'zip',
        type: 'address type',
        streetAddress: '123 C Street',
      }))
    })

    it('returns address type Placement Home if the legacy table name is PLC_HM_T', () => {
      const result = fromJS({
        addresses: [{
          city: 'city',
          state_code: 'state',
          zip: 'zip',
          type: {id: RESIDENCE_TYPE},
          street_number: '123',
          street_name: 'C Street',
          legacy_descriptor: {
            legacy_id: 'TSWY42i0V4',
            legacy_ui_id: '1673-3395-1268-0001926',
            legacy_last_updated: '2004-11-16T17:25:53.407-0800',
            legacy_table_name: 'PLC_HM_T',
            legacy_table_description: 'Placement Home',
          },
        }],
      })
      const state = fromJS({systemCodes})
      const addressResult = mapAddress(state, result)
      expect(addressResult).toEqualImmutable(fromJS({
        city: 'city',
        state: 'state',
        zip: 'zip',
        type: 'Placement Home',
        streetAddress: '123 C Street',
      }))
    })
  })

  describe('mapRaces', () => {
    it('maps races to lov values by id', () => {
      const result = fromJS({
        race_ethnicity: {
          race_codes: [
            {id: '3', description: 'Romanian'},
            {id: '2', description: 'French'},
            {id: '1', description: 'European'},
          ],
        },
      })
      const state = fromJS({systemCodes: {ethnicityTypes, raceTypes}})
      const racesResult = mapRaces(state, result)
      expect(racesResult).toEqualImmutable(
        fromJS([
          {race: 'Race 3', race_detail: 'Romanian'},
          {race: 'Race 2', race_detail: 'French'},
          {race: 'Race 1', race_detail: 'European'},
        ])
      )
    })

    it('maps races to "Abandoned" if unableToDetermineCode is "A"', () => {
      const result = fromJS({
        unable_to_determine_code: 'A',
      })
      const state = fromJS({systemCodes: {unableToDetermineCodes}})

      const racesResult = mapRaces(state, result)
      expect(racesResult).toEqualImmutable(
        fromJS(['Abandoned'])
      )
    })

    it('maps races to "Unknown" if unableToDetermineCode is "I"', () => {
      const result = fromJS({
        unable_to_determine_code: 'I',
      })
      const state = fromJS({systemCodes: {unableToDetermineCodes}})

      const racesResult = mapRaces(state, result)
      expect(racesResult).toEqualImmutable(
        fromJS(['Unknown'])
      )
    })

    it('maps races to "Unknown" if unableToDetermineCode is "K"', () => {
      const result = fromJS({
        unable_to_determine_code: 'K',
      })
      const state = fromJS({systemCodes: {unableToDetermineCodes}})

      const racesResult = mapRaces(state, result)
      expect(racesResult).toEqualImmutable(
        fromJS(['Unknown'])
      )
    })
  })

  describe('mapEthnicities', () => {
    it('maps hispanic codes to lov values', () => {
      const result = fromJS({
        race_ethnicity: {
          hispanic_origin_code: 'Y',
          hispanic_codes: [
            {id: '3', description: 'Romanian'},
            {id: '2', description: 'French'},
            {id: '1', description: 'European'},
          ],
        },
      })
      const state = fromJS({systemCodes: {ethnicityTypes, hispanicOriginCodes, raceTypes}})
      const racesResult = mapEthnicities(state, result)
      expect(racesResult).toEqualImmutable(
        fromJS({
          hispanic_latino_origin: 'yes', ethnicity_detail: ['Romanian', 'French', 'European']}
        )
      )
    })
  })
})
