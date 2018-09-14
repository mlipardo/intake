import {
  FETCH_RELATIONSHIPS,
  FETCH_RELATIONSHIPS_COMPLETE,
  CLEAR_RELATIONSHIPS,
  SET_CREATE_RELATION_BTN_STATUS,
} from 'actions/actionTypes'

export const BATCH_CREATE_RELATIONSHIPS = 'BATCH_CREATE_RELATIONSHIPS'
export const BATCH_CREATE_RELATIONSHIPS_COMPLETE = 'BATCH_CREATE_RELATIONSHIPS_COMPLETE'
export const BATCH_CREATE_RELATIONSHIPS_ERROR = 'BATCH_CREATE_RELATIONSHIPS_ERROR'
export const LOAD_CREATE_RELATIONSHIPS_CANDIDATES = 'LOAD_CREATE_RELATIONSHIPS_CANDIDATES'
export const RESET_CANDIDATE_FORM_FIELD = 'RESET_CANDIDATE_FORM_FIELD'
export const SET_CANDIDATE_FORM_FIELD = 'SET_CANDIDATE_FORM_FIELD'

export const batchCreateRelationships = (personId) => ({
  payload: {personId},
  type: BATCH_CREATE_RELATIONSHIPS,
})

export const batchCreateRelationshipsFaliure = (error) => ({
  error: true,
  payload: {error},
  type: BATCH_CREATE_RELATIONSHIPS_ERROR,
})

export const batchCreateRelationshipsSuccess = (relationships) => ({
  payload: {relationships},
  type: BATCH_CREATE_RELATIONSHIPS_COMPLETE,
})

export function clearRelationships() {
  return {type: CLEAR_RELATIONSHIPS}
}
export function fetchRelationshipsSuccess(relationships) {
  return {type: FETCH_RELATIONSHIPS_COMPLETE, payload: {relationships}}
}
export function fetchRelationshipsFailure(error) {
  return {type: FETCH_RELATIONSHIPS_COMPLETE, payload: {error}, error: true}
}
export function fetchRelationships(ids, screeningId = null) {
  return {type: FETCH_RELATIONSHIPS, payload: {ids, screeningId}}
}

export const resetFieldCandidate = (id) => ({
  type: RESET_CANDIDATE_FORM_FIELD,
  payload: {id},
})

export const setFieldCandidate = (personId, candidateId, fieldSet, value) => ({
  type: SET_CANDIDATE_FORM_FIELD,
  payload: {personId, candidateId, fieldSet, value},
})

export const setCreateRelationButtonStatus = (participants) => ({
  type: SET_CREATE_RELATION_BTN_STATUS,
  payload: {participants},
})
