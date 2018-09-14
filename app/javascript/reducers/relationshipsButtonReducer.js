import {SET_CREATE_RELATION_BTN_STATUS} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

const setCreateRelationshipsButtonStatus = (state, {payload: {participants}}) => {
  let createRelationshipsButtonStatus = false
  const participantCount = 1
  if (fromJS(participants).size > participantCount) {
    createRelationshipsButtonStatus = true
  }
  return fromJS({createRelationshipsButtonStatus: createRelationshipsButtonStatus})
}

export default createReducer(Map(), {
  [SET_CREATE_RELATION_BTN_STATUS]: setCreateRelationshipsButtonStatus})
