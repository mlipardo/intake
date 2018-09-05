import {connect} from 'react-redux'
import {BreadCrumb} from 'common/BreadCrumb'
import {getHasGenericErrorValueSelector} from 'selectors/errorsSelectors'

export const mapStateToProps = (state, {navigationElements}) => ({
  hasError: getHasGenericErrorValueSelector(state),
  navigationElements,
})

export default connect(mapStateToProps)(BreadCrumb)
