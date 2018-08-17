import {connect} from 'react-redux'
import {batchCreateRelationships} from 'actions/relationshipsActions'
import ScreeningCreateRelationship from 'views/ScreeningCreateRelationship'

const mapDispatchToProps = (dispatch) => ({
  batchCreateRelationships: (relationships) => {
    dispatch(batchCreateRelationships(relationships))
  }  
})
export default connect(null,mapDispatchToProps)(ScreeningCreateRelationship)
