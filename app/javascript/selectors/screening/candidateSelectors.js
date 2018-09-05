import {List, Map} from 'immutable'

export const selectCandidates = (state, id) =>
  state.get('candidatesForm').get(id, List())

export const selectCandidatesWithEdits = (state, id) => (Map({
  relationships: selectCandidates(state, id).map((candidate) => Map({
    client_id: candidate.getIn(['person', 'id']),
    relative_id: candidate.getIn(['candidate', 'id']),
    relationship_type: parseInt(candidate.getIn(['candidate', 'relationshipType']), 10),
    absent_parent_indicator: false,
    same_home_status: 'N',
  })),
}))
