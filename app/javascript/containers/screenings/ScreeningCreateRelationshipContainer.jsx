import {connect} from 'react-redux'
import ScreeningCreateRelationship from 'views/ScreeningCreateRelationship'
import {selectCandidateSelector} from 'selectors/screening/candidateSelectors'

const mapStateToProps = (state, {personId}) => ({
  candidates: selectCandidateSelector(state, personId).toJS(),
})

export default connect(mapStateToProps, {})(ScreeningCreateRelationship)

