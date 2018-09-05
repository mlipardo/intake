import * as matchers from 'jasmine-immutable-matchers'
import * as IntakeConfig from 'common/config'
import {
  fetchScreeningSuccess,
  createScreeningSuccess,
  saveSuccess,
} from 'actions/screeningActions'
import {
  createPersonSuccess,
} from 'actions/personCardActions'
import {fromJS} from 'immutable'
import rootReducer from 'reducers'
import {createStore} from 'redux'

describe('Store', () => {
  let initialState
  let store
  beforeEach(() => {
    jasmine.addMatchers(matchers)
    initialState = fromJS({
      allegationsForm: [],
      candidatesForm: {},
      crossReportForm: {},
      errors: {},
      incidentInformationForm: {},
      involvements: {},
      narrativeForm: {},
      pendingParticipants: [],
      participants: [],
      peopleForm: {},
      peopleSearch: {
        results: [],
        searchTerm: '',
        total: 0,
        isAddressIncluded: false,
      },
      relationship: {},
      relationships: [],
      relationshipsQueryCycleTime: [],
      routing: {locationBeforeTransitions: null},
      safelySurrenderedBaby: {
        persisted: {},
        form: {
          surrendered_by: null,
          relation_to_child: '1592',
          bracelet_id: '',
          parent_guardian_given_bracelet_id: 'U',
          parent_guardian_provided_med_questionaire: 'U',
          comments: '',
          med_questionaire_return_date: '',
        },
      },
      screening: {},
      screeningInformationForm: {},
      screeningDecisionForm: {},
      screeningPage: {},
      screenings: [],
      snapshot: {},
      staff: {},
      systemCodes: {
        addressCounties: [],
        addressTypes: [],
        allegationTypes: [],
        communicationMethods: [],
        csecTypes: [],
        counties: [],
        countyAgencies: [],
        ethnicityTypes: [],
        hispanicOriginCodes: [],
        languages: [],
        locations: [],
        raceTypes: [],
        relationshipTypes: [],
        screenResponseTimes: [],
        unableToDetermineCodes: [],
        usStates: [],
      },
      workerSafetyForm: {},
      userInfo: {},
    })
    store = createStore(rootReducer)
  })

  it('has initial state', () => {
    expect(store.getState()).toEqualImmutable(initialState)
  })

  it('handles fetch screening', () => {
    spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(false)
    const screening = fromJS({
      id: '1',
      name: 'Mock screening',
      participants: [{id: '2', legacy_id: '3', screening_id: '1', addresses: []}],
      allegations: [],
      incident_address: {},
    })
    const participants = screening.get('participants')
    const action = fetchScreeningSuccess(screening.toJS())
    store.dispatch(action)
    expect(store.getState().get('screening')).toEqualImmutable(
      fromJS({
        id: '1',
        name: 'Mock screening',
        allegations: [],
        incident_address: {},
        fetch_status: 'FETCHED',
      })
    )
    expect(store.getState().get('participants')).toEqualImmutable(participants)
  })

  it('handles create screening', () => {
    const screening = fromJS({
      id: '1',
      name: 'Mock screening',
      participants: [],
      incident_address: {id: '1111'},
    })
    const action = createScreeningSuccess(screening.toJS())
    store.dispatch(action)
    expect(store.getState().get('screening')).toEqualImmutable(
      fromJS({
        id: '1',
        name: 'Mock screening',
        fetch_status: 'FETCHED',
        incident_address: {id: '1111'},
      })
    )
    expect(store.getState().get('participants').isEmpty()).toEqual(true)
  })

  describe('when a screening already exists in the store', () => {
    beforeEach(() => {
      initialState = initialState.set(
        'screening',
        fromJS({
          id: '1',
          name: 'Mock screening',
          participants: [],
        })
      )
      store = createStore(rootReducer, initialState)
    })

    it('handles update screening', () => {
      const participants = fromJS([{id: '2', legacy_id: '3', screening_id: '1', addresses: []}])
      const updatedScreening = initialState.get('screening').set('participants', participants)
      const action = saveSuccess(updatedScreening.toJS())
      store.dispatch(action)
      expect(store.getState().get('screening')).toEqualImmutable(
        fromJS({
          id: '1',
          name: 'Mock screening',
          fetch_status: 'FETCHED',
        })
      )
      expect(store.getState().get('participants')).toEqualImmutable(participants)
    })

    it('handles create participant', () => {
      spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(false)
      const participant = {id: '2', legacy_id: '3', screening_id: '1', addresses: []}
      const participants = fromJS([participant])
      const action = createPersonSuccess(participant)
      store.dispatch(action)
      expect(store.getState().get('participants')).toEqualImmutable(participants)
    })
  })
})
