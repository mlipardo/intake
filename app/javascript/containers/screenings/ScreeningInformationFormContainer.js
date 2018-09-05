import {connect} from 'react-redux'
import ScreeningInformationForm from 'views/ScreeningInformationForm'
import COMMUNICATION_METHOD from 'enums/CommunicationMethod'
import REPORT_TYPE from 'enums/ReportType'
import {setField, touchField, touchAllFields} from 'actions/screeningInformationFormActions'
import {
  getScreeningInformationFormSelector,
  getVisibleErrorsSelector,
} from 'selectors/screening/screeningInformationFormSelectors'
import {generateBabyDoe} from 'actions/safelySurrenderedBabyActions'
import {saveCard, clearCardEdits} from 'actions/screeningActions'
import {getScreeningSelector} from 'selectors/screeningSelectors'

export const cardName = 'screening-information-card'

const communicationMethods = Object.keys(COMMUNICATION_METHOD)
  .map((value) => ({value, label: COMMUNICATION_METHOD[value]}))

const reportTypes = Object.keys(REPORT_TYPE)
  .map((value) => ({value, label: REPORT_TYPE[value]}))

const mapStateToProps = (state) => {
  const screening = getScreeningSelector(state)
  const screeningInformationForm = getScreeningInformationFormSelector(state)
  return {
    assignee: screeningInformationForm.getIn(['assignee', 'value']),
    assigneeDisabled: Boolean(screening.get('assignee_staff_id')),
    communicationMethod: screeningInformationForm.getIn(['communication_method', 'value']),
    communicationMethods,
    endedAt: screeningInformationForm.getIn(['ended_at', 'value']),
    errors: getVisibleErrorsSelector(state).toJS(),
    name: screeningInformationForm.getIn(['name', 'value']),
    persistedReportType: screening.get('report_type'),
    reportType: screeningInformationForm.getIn(['report_type', 'value']),
    reportTypes,
    screeningId: screening.get('id'),
    startedAt: screeningInformationForm.getIn(['started_at', 'value']),
  }
}

export const mapDispatchToProps = (dispatch, {onShow}) => ({
  onBlur: (fieldName) => dispatch(touchField(fieldName)),
  onCancel: () => {
    dispatch(clearCardEdits(cardName))
    dispatch(touchAllFields())
    onShow()
  },
  onChange: (fieldName, value) => dispatch(setField(fieldName, value)),
  dispatch,
})

export const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onSave: () => {
    if (stateProps.reportType === 'ssb' && stateProps.persistedReportType !== 'ssb') {
      dispatchProps.dispatch(generateBabyDoe(stateProps.screeningId))
    } else {
      dispatchProps.dispatch(saveCard(cardName))
    }
    dispatchProps.dispatch(touchAllFields())
    ownProps.onSave()
  },
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ScreeningInformationForm)
