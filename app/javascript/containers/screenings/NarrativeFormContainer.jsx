import NarrativeForm from 'views/NarrativeForm'
import {
  getReportNarrativeValueSelector,
  getVisibleErrorsSelector,
} from 'selectors/screening/narrativeFormSelectors'
import {setField, touchField, touchAllFields} from 'actions/narrativeFormActions'
import {saveCard, clearCardEdits} from 'actions/screeningActions'
import {connect} from 'react-redux'

export const cardName = 'narrative-card'

const mapStateToProps = (state) => (
  {
    reportNarrative: {
      value: getReportNarrativeValueSelector(state),
      errors: getVisibleErrorsSelector(state).get('report_narrative').toJS(),
    },
  }
)

export const mapDispatchToProps = (dispatch, {onShow, onSave}) => ({
  onBlur: (fieldName) => dispatch(touchField(fieldName)),
  onCancel: () => {
    dispatch(clearCardEdits(cardName))
    dispatch(touchAllFields())
    onShow()
  },
  onChange: (fieldName, value) => dispatch(setField(fieldName, value)),
  onSave: () => {
    dispatch(saveCard(cardName))
    dispatch(touchAllFields())
    onSave()
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(NarrativeForm)
