import {connect} from 'react-redux'
import PersonSearchForm from 'views/people/PersonSearchForm'
import {selectParticipants} from 'selectors/participantSelectors'
import {
  selectPeopleResults,
  selectResultsTotalValue,
  selectSearchTermValue,
  selectSearchAddressValue,
  selectStartTime,
  selectSearchCounty,
} from 'selectors/peopleSearchSelectors'
import {
  search,
  setSearchTerm,
  setSearchCounty,
  clear,
  loadMoreResults,
  toggleAddressSearch,
} from 'actions/peopleSearchActions'
import {canUserAddClient} from 'utils/authorization'
import {getStaffIdSelector} from 'selectors/userInfoSelectors'

const mapStateToProps = (state) => {
  const userInfo = state.get('userInfo').toJS()
  const hasAddSensitivePerson = state.getIn(['staff', 'add_sensitive_people'])
  const hasOverride = state.getIn(['staff', 'has_state_override'])
  const isSelectable = (person) => canUserAddClient(userInfo, hasAddSensitivePerson, person, hasOverride)

  return {
    results: selectPeopleResults(state).toJS(),
    total: selectResultsTotalValue(state),
    searchTerm: selectSearchTermValue(state),
    searchCounty: selectSearchCounty(state),
    isAddressIncluded: selectSearchAddressValue(state),
    staffId: getStaffIdSelector(state),
    startTime: selectStartTime(state),
    participants: selectParticipants(state).toJS(),
    isSelectable,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const onClear = () => dispatch(clear())
  const onChange = (value) => dispatch(setSearchTerm(value))
  const onChangeCounty = (value) => dispatch(setSearchCounty(value))
  const onSearch = (value) => dispatch(search(value, ownProps.isClientOnly))
  const onLoadMoreResults = () => dispatch(loadMoreResults(ownProps.isClientOnly))
  const onToggleAddressSearch = () => dispatch(toggleAddressSearch())
  return {
    onSearch,
    onClear,
    onChange,
    onChangeCounty,
    onLoadMoreResults,
    onToggleAddressSearch,
    dispatch,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonSearchForm)
