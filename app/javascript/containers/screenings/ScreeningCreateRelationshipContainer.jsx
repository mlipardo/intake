import {connect} from 'react-redux'
import {batchCreateRelationships} from 'actions/relationshipsActions'
import ScreeningCreateRelationship from 'views/ScreeningCreateRelationship'
import {selectCandidateSelector} from 'selectors/screening/candidateSelectors'

const mapStateToProps = (state, {personId}) => ({
  candidates: selectCandidateSelector(state, personId).toJS(),
})

const mapDispatchToProps = (dispatch) => ({
  batchCreateRelationships: (relationships) => {
    dispatch(batchCreateRelationships(relationships))
  }  
})
export default connect(mapStateToProps,mapDispatchToProps)(ScreeningCreateRelationship)
