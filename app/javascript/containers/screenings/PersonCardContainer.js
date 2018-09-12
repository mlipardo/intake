import {connect} from 'react-redux'
import PersonCard from 'views/people/PersonCard'
import {
  getModeValueSelector,
  getPersonNamesSelector,
  selectInformationalMessage,
  getPersonInformationFlagValuesSelector,
} from 'selectors/screening/personCardSelectors'
import {savePerson, deletePerson} from 'actions/personCardActions'
import {EDIT_MODE, SAVING_MODE, SHOW_MODE, setPersonCardMode} from 'actions/screeningPageActions'
import {touchAllFields} from 'actions/peopleFormActions'

const mapStateToProps = (state, {personId}) => ({
  mode: getModeValueSelector(state, personId),
  editable: !state.getIn(['screening', 'referral_id']),
  deletable: !state.getIn(['screening', 'referral_id']),
  informationFlag: getPersonInformationFlagValuesSelector(state).get(personId),
  personName: getPersonNamesSelector(state).get(personId),
  informationPill: selectInformationalMessage(state, personId),
})

export const mapDispatchToProps = (dispatch, {personId}) => ({
  onCancel: () => {
    dispatch(setPersonCardMode(personId, SHOW_MODE))
  },
  onDelete: () => dispatch(deletePerson(personId)),
  onEdit: () => dispatch(setPersonCardMode(personId, EDIT_MODE)),
  onSave: () => {
    dispatch(savePerson(personId))
    dispatch(touchAllFields(personId))
    dispatch(setPersonCardMode(personId, SAVING_MODE))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(PersonCard)
