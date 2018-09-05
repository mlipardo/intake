import {connect} from 'react-redux'
import PersonSearchForm from 'views/people/PersonSearchForm'
import {selectParticipants} from 'selectors/participantSelectors'
import {
  getPeopleResultsSelector,
  getResultsTotalValueSelector,
  getSearchTermValueSelector,
  getSearchAddressValueSelector,
  getStartTimeSelector,
} from 'selectors/peopleSearchSelectors'
import {search, setSearchTerm, clear, loadMoreResults, toggleAddressSearch} from 'actions/peopleSearchActions'
import {canUserAddClient} from 'utils/authorization'
import {getStaffIdSelector} from 'selectors/userInfoSelectors'

const mapStateToProps = (state) => {
  const userInfo = state.get('userInfo').toJS()
  const hasAddSensitivePerson = state.getIn(['staff', 'add_sensitive_people'])
  const hasOverride = state.getIn(['staff', 'has_state_override'])
  const isSelectable = (person) => canUserAddClient(userInfo, hasAddSensitivePerson, person, hasOverride)

  return {
    results: getPeopleResultsSelector(state).toJS(),
    total: getResultsTotalValueSelector(state),
    searchTerm: getSearchTermValueSelector(state),
    isAddressIncluded: getSearchAddressValueSelector(state),
    staffId: getStaffIdSelector(state),
    startTime: getStartTimeSelector(state),
    participants: selectParticipants(state).toJS(),
    isSelectable,
  }
}

const mapDispatchToProps = (dispatch, _ownProps) => {
  const onClear = () => dispatch(clear())
  const onChange = (value) => dispatch(setSearchTerm(value))
  const onSearch = (value) => dispatch(search(value))
  const onLoadMoreResults = () => dispatch(loadMoreResults())
  const onToggleAddressSearch = () => dispatch(toggleAddressSearch())
  return {
    onSearch,
    onClear,
    onChange,
    onLoadMoreResults,
    onToggleAddressSearch,
    dispatch,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonSearchForm)
