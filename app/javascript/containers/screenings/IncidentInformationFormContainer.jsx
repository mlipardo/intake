import {connect} from 'react-redux'
import {
  getIncidentDateSelector,
  getIncidentCountySelector,
  getAddressSelector,
  getLocationTypeSelector,
  selectCounties,
  getLocationOfChildrenSelector,
  getStates,
  getLocationTypes,
  getVisibleErrorsSelector,
} from 'selectors/screening/incidentInformationFormSelector'
import IncidentInformationForm from 'views/IncidentInformationForm'
import {
  setField,
  touchAllFields,
  touchField,
} from 'actions/incidentInformationFormActions'
import {saveCard, clearCardEdits} from 'actions/screeningActions'

export const cardName = 'incident-information-card'

const mapStateToProps = (state) => ({
  errors: getVisibleErrorsSelector(state).toJS(),
  incidentDate: getIncidentDateSelector(state),
  selectedCounty: getIncidentCountySelector(state),
  address: getAddressSelector(state).toJS(),
  selectedLocationType: getLocationTypeSelector(state),
  counties: selectCounties(state),
  usStates: getStates(),
  locationTypes: getLocationTypes(),
  locationOfChildren: getLocationOfChildrenSelector(state),
})

export const mapDispatchToProps = (dispatch, {onSave, onShow}) => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(IncidentInformationForm)
