import {connect} from 'react-redux'
import ScreeningDecisionForm from 'views/ScreeningDecisionForm'
import {
  getAccessRestrictionOptionsSelector,
  getAccessRestrictionSelector,
  getAdditionalInformationSelector,
  getDecisionDetailOptionsSelector,
  getDecisionDetailSelector,
  getDecisionOptionsSelector,
  getDecisionSelector,
  getRestrictionRationaleSelector,
  getAdditionalInfoRequiredSelector,
  getDecisionAlertErrorMessageSelector,
  selectContactReference,
} from 'selectors/screening/decisionFormSelectors'
import {saveCard, clearCardEdits} from 'actions/screeningActions'
import {
  setField,
  touchField,
  touchAllFields,
} from 'actions/screeningDecisionFormActions'
import {sdmPath} from 'common/config'

export const cardName = 'decision-card'

const mapStateToProps = (state) => (
  {
    alertErrorMessage: getDecisionAlertErrorMessageSelector(state),
    accessRestriction: getAccessRestrictionSelector(state).toJS(),
    accessRestrictionOptions: getAccessRestrictionOptionsSelector().toJS(),
    additionalInformation: getAdditionalInformationSelector(state).toJS(),
    decision: getDecisionSelector(state).toJS(),
    decisionDetail: getDecisionDetailSelector(state).toJS(),
    decisionDetailOptions: getDecisionDetailOptionsSelector(state).toJS(),
    decisionOptions: getDecisionOptionsSelector(state).toJS(),
    restrictionRationale: getRestrictionRationaleSelector(state).toJS(),
    screeningContactReference: selectContactReference(state).toJS(),
    sdmPath: sdmPath(),
    isAdditionalInfoRequired: getAdditionalInfoRequiredSelector(state),
  }
)

export const mapDispatchToProps = (dispatch, {onShow, onSave}) => ({
  onBlur: (field) => dispatch(touchField({field})),
  onCancel: () => {
    dispatch(clearCardEdits(cardName))
    onShow()
  },
  onChange: (field, value) => {
    dispatch(setField({field, value}))
    if (field === 'screening_decision') {
      dispatch(setField({field: 'screening_decision_detail', value: null}))
      dispatch(setField({field: 'screening_contact_reference', value: null}))
    }
    if (field === 'access_restrictions' && value === '') {
      dispatch(setField({field: 'restrictions_rationale', value: null}))
    }
  },
  onSave: () => {
    dispatch(saveCard(cardName))
    dispatch(touchAllFields())
    onSave()
  },
  dispatch,
})

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningDecisionForm)
