import {CREATE_PERSON_COMPLETE, UPDATE_PERSON_COMPLETE} from 'actions/personCardActions'
import {CREATE_SCREENING_COMPLETE, FETCH_SCREENING_COMPLETE} from 'actions/actionTypes'
import {Map} from 'immutable'
import {
  SET_SCREENING_PAGE_MODE,
  SET_PERSON_CARD_MODE,
  SET_SCREENING_CARD_MODE,
  EDIT_MODE,
  SHOW_MODE,
  SAVING_MODE,
} from 'actions/screeningPageActions'
import {SAVE_SCREENING, SAVE_SCREENING_COMPLETE} from 'actions/screeningActions'
import {createReducer} from 'utils/createReducer'

function cards(mode) {
  return Map(
    [
      'screening-information-card',
      'narrative-card',
      'incident-information-card',
      'cross-report-card',
      'worker-safety-card',
      'decision-card',
      'allegations-card',
    ].reduce((cards, card) => ({...cards, [card]: mode}), {})
  )
}

function peopleCards({participants}, mode) {
  return Map(
    participants.reduce((peopleCards, {id}) => ({...peopleCards, [id]: mode}), {})
  )
}

function modeOnScreeningFetch(state, referralId) {
  if (referralId) {
    return SHOW_MODE
  } else {
    return state.get('mode')
  }
}

const savingToShow = (mode) => (mode === SAVING_MODE ? SHOW_MODE : mode)

const setAllSavingToShow = (state, _action) =>
  state.update('cards', Map(), (cards) => cards.map(savingToShow))

export default createReducer(Map(), {
  [SET_SCREENING_PAGE_MODE]: (state, {payload: {mode}}) => state.set('mode', mode),
  [SET_PERSON_CARD_MODE]: (state, {payload: {personId, mode}}) => state.setIn(['peopleCards', personId], mode),
  [SET_SCREENING_CARD_MODE]: (state, {payload: {card, mode}}) => state.setIn(['cards', card], mode),
  [FETCH_SCREENING_COMPLETE]: (state, {payload: {screening}, error}) => {
    if (error) {
      return state
    } else {
      const mode = modeOnScreeningFetch(state, screening.referral_id)
      return state.set('mode', mode)
        .set('peopleCards', peopleCards(screening, mode))
        .set('cards', cards(mode))
    }
  },
  [CREATE_PERSON_COMPLETE]: (state, {payload: {person}, error}) => {
    if (error) {
      return state
    } else {
      return state.setIn(['peopleCards', person.id], EDIT_MODE)
    }
  },
  [UPDATE_PERSON_COMPLETE]: (state, {payload: {person, personId}, error}) => {
    const id = error ? personId : person.id
    return state.updateIn(['peopleCards', id], savingToShow)
  },
  [SAVE_SCREENING]: (state, {payload: {card}}) => state.setIn(['cards', card], SAVING_MODE),
  [CREATE_SCREENING_COMPLETE]: setAllSavingToShow,
  [SAVE_SCREENING_COMPLETE]: setAllSavingToShow,
})
