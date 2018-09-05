import * as matchers from 'jasmine-immutable-matchers'
import screeningPageReducer from 'reducers/screeningPageReducer'
import {Map, fromJS} from 'immutable'
import {
  createPersonSuccess,
  createPersonFailure,
  updatePersonSuccess,
  updatePersonFailure,
} from 'actions/personCardActions'
import {
  EDIT_MODE,
  SHOW_MODE,
  SAVING_MODE,
  setPageMode,
  setPersonCardMode,
  setCardMode,
} from 'actions/screeningPageActions'
import {
  createScreeningSuccess,
  createScreeningFailure,
  fetchScreeningSuccess,
  fetchScreeningFailure,
  saveCard,
  saveSuccess,
  saveFailure,
} from 'actions/screeningActions'

describe('screeningPageReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on SET_SCREENING_PAGE_MODE', () => {
    const initialState = Map()

    it('returns the screening page with the updated mode', () => {
      const action = setPageMode(EDIT_MODE)
      expect(screeningPageReducer(initialState, action)).toEqualImmutable(
        fromJS({mode: EDIT_MODE})
      )
    })
  })

  describe('on SET_PERSON_CARD_MODE', () => {
    const initialState = fromJS({mode: EDIT_MODE})

    it('returns the screening page with the updated person card mode', () => {
      const personId = 'some-arbitrary-id'
      const action = setPersonCardMode(personId, SHOW_MODE)
      expect(screeningPageReducer(initialState, action)).toEqualImmutable(
        fromJS({
          mode: EDIT_MODE,
          peopleCards: {'some-arbitrary-id': SHOW_MODE},
        })
      )
    })
  })

  describe('on SET_SCREENING_CARD_MODE', () => {
    const initialState = fromJS({mode: EDIT_MODE})

    it('returns the screening page with the updated mode for the given card', () => {
      const cardId = 'some-card'
      const action = setCardMode(cardId, SHOW_MODE)
      expect(screeningPageReducer(initialState, action)).toEqualImmutable(
        fromJS({
          mode: EDIT_MODE,
          cards: {'some-card': SHOW_MODE},
        })
      )
    })
  })

  describe('on FETCH_SCREENING_COMPLETE', () => {
    it('when an error occurs returns current screening page', () => {
      const initialState = fromJS({mode: SHOW_MODE})
      const action = fetchScreeningFailure()
      expect(screeningPageReducer(initialState, action)).toEqualImmutable(initialState)
    })

    describe('on successful fetching of a screening', () => {
      const participants = [
        {id: 'participant_id_one'},
        {id: 'participant_id_two'},
      ]
      const screening = {participants}
      const action = fetchScreeningSuccess(screening)

      describe('when screening page mode is SHOW_MODE', () => {
        const initialState = fromJS({mode: SHOW_MODE})
        it('returns screening page with each persons mode set to SHOW_MODE', () => {
          expect(screeningPageReducer(initialState, action)).toEqualImmutable(
            fromJS({
              mode: SHOW_MODE,
              peopleCards: {
                participant_id_one: SHOW_MODE,
                participant_id_two: SHOW_MODE,
              },
              cards: {
                'screening-information-card': SHOW_MODE,
                'narrative-card': SHOW_MODE,
                'incident-information-card': SHOW_MODE,
                'cross-report-card': SHOW_MODE,
                'worker-safety-card': SHOW_MODE,
                'decision-card': SHOW_MODE,
                'allegations-card': SHOW_MODE,
              },
            })
          )
        })
      })

      describe('when screening page mode is EDIT_MODE', () => {
        const initialState = fromJS({mode: EDIT_MODE})
        it('returns screening page with each persons mode set to EDIT_MODE', () => {
          expect(screeningPageReducer(initialState, action)).toEqualImmutable(
            fromJS({
              mode: EDIT_MODE,
              peopleCards: {
                participant_id_one: EDIT_MODE,
                participant_id_two: EDIT_MODE,
              },
              cards: {
                'screening-information-card': EDIT_MODE,
                'narrative-card': EDIT_MODE,
                'incident-information-card': EDIT_MODE,
                'cross-report-card': EDIT_MODE,
                'worker-safety-card': EDIT_MODE,
                'decision-card': EDIT_MODE,
                'allegations-card': EDIT_MODE,
              },
            })
          )
        })
      })

      describe('when screening has a referral id and is not editable', () => {
        const initialState = fromJS({mode: EDIT_MODE})
        const participants = [
          {id: 'participant_id_one'},
          {id: 'participant_id_two'},
        ]
        const nonEditableScreening = {referral_id: 'referral_id', participants}
        const newAction = fetchScreeningSuccess(nonEditableScreening)
        it('returns screening page with all cards set to SHOW_MODE', () => {
          expect(screeningPageReducer(initialState, newAction)).toEqualImmutable(
            fromJS({
              mode: SHOW_MODE,
              peopleCards: {
                participant_id_one: SHOW_MODE,
                participant_id_two: SHOW_MODE,
              },
              cards: {
                'screening-information-card': SHOW_MODE,
                'narrative-card': SHOW_MODE,
                'incident-information-card': SHOW_MODE,
                'cross-report-card': SHOW_MODE,
                'worker-safety-card': SHOW_MODE,
                'decision-card': SHOW_MODE,
                'allegations-card': SHOW_MODE,
              },
            })
          )
        })
      })
    })
  })
  describe('on CREATE_PERSON_COMPLETE', () => {
    const initialState = fromJS({mode: SHOW_MODE})
    const newPerson = {id: 'some-arbitrary-id'}

    describe('when there is no error', () => {
      const action = createPersonSuccess(newPerson)

      it('returns the screening page with the created person card in edit mode', () => {
        expect(screeningPageReducer(initialState, action)).toEqualImmutable(
          fromJS({
            mode: SHOW_MODE,
            peopleCards: {'some-arbitrary-id': EDIT_MODE},
          })
        )
      })
    })
    describe('when there is an error', () => {
      it('returns the screening page untouched', () => {
        const action = createPersonFailure()
        expect(screeningPageReducer(initialState, action)).toEqualImmutable(
          initialState
        )
      })
    })
  })

  describe('on UPDATE_PERSON_COMPLETE', () => {
    it('updates the matching card from Saving to Show mode on Success', () => {
      const initialState = fromJS({
        mode: SHOW_MODE,
        peopleCards: {
          aaa: SAVING_MODE,
          bbb: SAVING_MODE,
        },
      })
      const action = updatePersonSuccess({id: 'aaa'})
      const newState = screeningPageReducer(initialState, action)
      expect(newState.getIn(['peopleCards', 'aaa'])).toEqual(SHOW_MODE)
      expect(newState.getIn(['peopleCards', 'bbb'])).toEqual(SAVING_MODE)
    })

    it('updates the matching card from Saving to Show mode on Error', () => {
      const initialState = fromJS({
        mode: SHOW_MODE,
        peopleCards: {
          aaa: SAVING_MODE,
          bbb: SAVING_MODE,
        },
      })
      const action = updatePersonFailure('Some Error', 'bbb')
      const newState = screeningPageReducer(initialState, action)
      expect(newState.getIn(['peopleCards', 'bbb'])).toEqual(SHOW_MODE)
      expect(newState.getIn(['peopleCards', 'aaa'])).toEqual(SAVING_MODE)
    })
  })

  describe('on SAVE_SCREENING', () => {
    const initialState = fromJS({
      cards: {
        'narrative-card': EDIT_MODE,
        'allegations-card': EDIT_MODE,
        'decision-card': SHOW_MODE,
      },
    })

    it('sets the saved card to saving mode', () => {
      const action = saveCard('narrative-card')
      const newState = screeningPageReducer(initialState, action)
      expect(newState.getIn(['cards', 'narrative-card'])).toEqual(SAVING_MODE)
    })

    it('leaves other cards untouched', () => {
      const action = saveCard('narrative-card')
      const newState = screeningPageReducer(initialState, action)
      expect(newState.getIn(['cards', 'allegations-card'])).toEqual(EDIT_MODE)
      expect(newState.getIn(['cards', 'decision-card'])).toEqual(SHOW_MODE)
    })
  })

  describe('on SAVE_SCREENING_COMPLETE', () => {
    const initialState = fromJS({
      cards: {
        'narrative-card': SAVING_MODE,
        'allegations-card': SAVING_MODE,
        'worker-safety-card': EDIT_MODE,
        'decision-card': SHOW_MODE,
      },
    })
    it('sets any saving cards to Show mode on success', () => {
      const action = saveSuccess('Fake Screening')
      const newState = screeningPageReducer(initialState, action)
      expect(newState).toEqualImmutable(fromJS({
        cards: {
          'narrative-card': SHOW_MODE,
          'allegations-card': SHOW_MODE,
          'worker-safety-card': EDIT_MODE,
          'decision-card': SHOW_MODE,
        },
      }))
    })

    it('sets any saving cards to Show mode on error', () => {
      const action = saveFailure('Error!')
      const newState = screeningPageReducer(initialState, action)
      expect(newState).toEqualImmutable(fromJS({
        cards: {
          'narrative-card': SHOW_MODE,
          'allegations-card': SHOW_MODE,
          'worker-safety-card': EDIT_MODE,
          'decision-card': SHOW_MODE,
        },
      }))
    })
  })

  describe('on CREATE_SCREENING_COMPLETE', () => {
    const initialState = fromJS({
      cards: {
        'narrative-card': SAVING_MODE,
        'allegations-card': SAVING_MODE,
        'worker-safety-card': EDIT_MODE,
        'decision-card': SHOW_MODE,
      },
    })
    it('sets any saving cards to Show mode on success', () => {
      const action = createScreeningSuccess('Fake Screening')
      const newState = screeningPageReducer(initialState, action)
      expect(newState).toEqualImmutable(fromJS({
        cards: {
          'narrative-card': SHOW_MODE,
          'allegations-card': SHOW_MODE,
          'worker-safety-card': EDIT_MODE,
          'decision-card': SHOW_MODE,
        },
      }))
    })

    it('sets any saving cards to Show mode on error', () => {
      const action = createScreeningFailure('Error!')
      const newState = screeningPageReducer(initialState, action)
      expect(newState).toEqualImmutable(fromJS({
        cards: {
          'narrative-card': SHOW_MODE,
          'allegations-card': SHOW_MODE,
          'worker-safety-card': EDIT_MODE,
          'decision-card': SHOW_MODE,
        },
      }))
    })
  })
})
