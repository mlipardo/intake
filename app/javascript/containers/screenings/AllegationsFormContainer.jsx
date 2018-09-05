import {connect} from 'react-redux'
import AllegationsForm from 'views/AllegationsForm'
import {
  getAllegationTypesSelector,
  getFormattedAllegationsSelector,
  getAllegationsRequiredValueSelector,
  getAllegationsAlertErrorMessageSelector,
} from 'selectors/screening/allegationsFormSelectors'
import {saveCard, clearCardEdits} from 'actions/screeningActions'
import {setAllegationTypes} from 'actions/allegationsFormActions'

export const cardName = 'allegations-card'

const mapStateToProps = (state) => (
  {
    alertErrorMessage: getAllegationsAlertErrorMessageSelector(state),
    allegations: getFormattedAllegationsSelector(state).toJS(),
    allegationTypes: getAllegationTypesSelector(state).toJS(),
    required: getAllegationsRequiredValueSelector(state),
  }
)

export const mapDispatchToProps = (dispatch, {onSave, onShow}) => ({
  onCancel: () => {
    dispatch(clearCardEdits(cardName))
    onShow()
  },
  onChange: (props) => {
    dispatch(setAllegationTypes(props))
  },
  onSave: () => {
    dispatch(saveCard(cardName))
    onSave()
  },
  dispatch,
})

export default connect(mapStateToProps, mapDispatchToProps)(AllegationsForm)
