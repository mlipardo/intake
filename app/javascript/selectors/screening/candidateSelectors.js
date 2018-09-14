import {List, Map} from 'immutable'
import {Maybe} from 'utils/maybe'

export const selectCandidates = (state, id) =>
  state.get('candidatesForm').get(id, List())

const isEmptyRelationship = (candidate) =>
  candidate.get('relationship_type') === null

const toCode = (candidate) =>
  Maybe.of(candidate.getIn(['candidate', 'relationshipType']))
    .map((type) => parseInt(type, 10))
    .filter((type) => !isNaN(type))
    .valueOrElse(null)

export const selectCandidatesWithEdits = (state, id) => (Map({
  relationships: selectCandidates(state, id)
    .map((candidate) => Map({
      client_id: candidate.getIn(['person', 'id']),
      relative_id: candidate.getIn(['candidate', 'id']),
      relationship_type: toCode(candidate),
      absent_parent_indicator: false,
      same_home_status: 'N',
    }))
    .filterNot(isEmptyRelationship),
}))

export const selectIsDisabledForm = (state) => state.getIn(['candidatesForm', 'isDisabled'])
