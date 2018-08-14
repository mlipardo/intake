import {
  CREATE_SCREENING_COMPLETE,
  FETCH_SCREENING_COMPLETE,
} from 'actions/actionTypes'
import {
  CREATE_PERSON_COMPLETE,
  DELETE_PERSON_COMPLETE,
  UPDATE_PERSON_COMPLETE,
  CLEAR_PEOPLE,
  MARK_PERSON_OLD,
} from 'actions/personCardActions'
import {SAVE_SCREENING_COMPLETE} from 'actions/screeningActions'
import {createReducer} from 'utils/createReducer'
import {List, fromJS} from 'immutable'

const transformPerson = (person) => {
  if (person.get('csec')) {
    return person.merge({
      csec_ids: person.get('csec').map((entry) => entry.get('id')),
      csec_types: person.get('csec').reduce((result, entry) => (
        result.push(entry.get('csec_code_id'))
      ), List()),
      csec_started_at: person.getIn(['csec', 0, 'start_date']) || '',
      csec_ended_at: person.getIn(['csec', 0, 'end_date']) || '',
    }).remove('csec')
  } else {
    return person
  }
}

const getParticipantsOnScreening = (state, {payload, error}) => {
  if (error) {
    return state
  } else {
    return fromJS(payload.screening.participants.map((participant) => transformPerson(fromJS(participant))))
  }
}

export default createReducer(List(), {
  [CREATE_SCREENING_COMPLETE]: getParticipantsOnScreening,
  [FETCH_SCREENING_COMPLETE]: getParticipantsOnScreening,
  [SAVE_SCREENING_COMPLETE]: getParticipantsOnScreening,
  [CREATE_PERSON_COMPLETE](state, {payload: {person}, error}) {
    if (error) {
      return state
    } else {
      const newPerson = transformPerson(fromJS(person))
      return state.unshift(newPerson)
    }
  },
  [DELETE_PERSON_COMPLETE](state, {payload: {id}, error}) {
    if (error) {
      return state
    } else {
      return state.filterNot((x) => x.get('id') === id)
    }
  },
  [UPDATE_PERSON_COMPLETE](state, {payload: {person}, error}) {
    if (error) {
      return state
    } else {
      const updatedPerson = transformPerson(fromJS(person))
      const personIndex = state.findIndex((x) => x.get('id') === updatedPerson.get('id'))
      return state.setIn([personIndex], updatedPerson)
    }
  },
  [CLEAR_PEOPLE]() {
    return List()
  },
  [MARK_PERSON_OLD](state, {payload: {person}, error}) {
    if (error) {
      return state
    }
    
    const updatedPerson = transformPerson(fromJS(person))
    const personIndex = state.findIndex((x) => x.get('id') === updatedPerson.get('id'))
    return state.setIn([personIndex,'newly_created_person'],false )
  },
})
