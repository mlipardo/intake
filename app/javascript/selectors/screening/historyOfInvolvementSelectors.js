import {createSelector} from 'reselect'
import {Map, List, fromJS} from 'immutable'
import nameFormatter from 'utils/nameFormatter'
import {accessDescription} from 'utils/accessIndicator'
import {dateRangeFormatter} from 'utils/dateFormatter'
import {systemCodeDisplayValue, selectScreenResponseTimes, selectRelationshipTypes} from 'selectors/systemCodeSelectors'
import {hasNonReporter} from 'utils/roles'

const getHistoryOfInvolvementsSelector = (state) => state.get('involvements', Map())

const getCasesSelector = createSelector(
  getHistoryOfInvolvementsSelector,
  (hoi) => hoi.get('cases', List())
)

const formatDisposition = (disposition) => {
  const formattedDisposition = disposition ? `(${ disposition })` : ''
  return formattedDisposition
}

const getCaseCountyAndStatus = (hoiCase) => {
  const status = hoiCase.get('end_date') ? 'Closed' : 'Open'
  const serviceComponent = hoiCase.getIn(['service_component', 'description'])
  const county = hoiCase.getIn(['county', 'description'])

  return {
    county,
    status: [status, serviceComponent].filter((n) => n).join(' - '),
  }
}

const getParentsNames = (hoiCase, relationshipTypes) => {
  const parentTypeRegExp = new RegExp('\\(.*?\\)')
  return hoiCase.get('parents', List()).map((parent) => {
    let fullName = nameFormatter(parent.toJS())
    const parentType = parentTypeRegExp[Symbol.match](systemCodeDisplayValue(parent.getIn(['relationship', 'id']), relationshipTypes))
    if (parentType) {
      fullName = fullName.concat(' ', parentType)
    }
    return fullName
  }).join(', ')
}

export const getFormattedCasesSelector = createSelector(
  getCasesSelector,
  selectRelationshipTypes,
  (cases, relationshipTypes) => cases.map((hoiCase) => {
    const {county, status} = getCaseCountyAndStatus(hoiCase)
    const limitedAccessCode = hoiCase.getIn(['access_limitation', 'limited_access_code'], 'NONE')
    return fromJS({
      caseId: hoiCase.getIn(['legacy_descriptor', 'legacy_ui_id']),
      caseLegacyId: hoiCase.getIn(['legacy_descriptor', 'legacy_id']),
      county: county,
      dateRange: dateRangeFormatter(hoiCase.toJS()),
      focusChild: nameFormatter(hoiCase.get('focus_child', Map()).toJS()),
      parents: getParentsNames(hoiCase, relationshipTypes),
      restrictedAccessStatus: accessDescription(limitedAccessCode),
      status: status,
      worker: nameFormatter({name_default: '', ...hoiCase.get('assigned_social_worker', Map()).toJS()}),
    })
  })
)

const getReferralsSelector = createSelector(
  getHistoryOfInvolvementsSelector,
  (hoi) => hoi.get('referrals') || List()
)

const getReferralCountyAndStatus = (referral, responseTimes) => {
  const status = referral.get('end_date') ? 'Closed' : 'Open'
  const maybeResponseTimeID = referral.getIn(['response_time', 'id'])
  const responseTime = maybeResponseTimeID ?
    systemCodeDisplayValue(maybeResponseTimeID, responseTimes) :
    referral.get('response_time')

  return {
    county: referral.getIn(['county', 'description']),
    status: [status, responseTime].filter((n) => n).join(' - '),
  }
}

const getMixedReferralAllegations = (allegation) => Map({
  victim: nameFormatter({
    first_name: allegation.getIn(['victim', 'first_name']),
    middle_name: allegation.getIn(['victim', 'middle_name']),
    last_name: allegation.getIn(['victim', 'last_name']),
    name_suffix: allegation.getIn(['victim', 'name_suffix']),
    name_default: ''}),
  perpetrator: nameFormatter({
    first_name: allegation.getIn(['perpetrator', 'first_name']),
    middle_name: allegation.getIn(['perpetrator', 'middle_name']),
    last_name: allegation.getIn(['perpetrator', 'last_name']),
    name_suffix: allegation.getIn(['perpetrator', 'name_suffix']),
    name_default: ''}),
  allegations: allegation.getIn(['type', 'description'], ''),
  disposition: formatDisposition(allegation.getIn(['disposition', 'description'])
  ),
})

export const getFormattedReferralsSelector = createSelector(
  getReferralsSelector,
  selectScreenResponseTimes,
  (referrals, responseTimes) => referrals.map((referral) => {
    const {county, status} = getReferralCountyAndStatus(referral, responseTimes)
    const limitedAccessCode = referral.getIn(['access_limitation', 'limited_access_code'], 'NONE')
    const peopleAndRoles = referral.get('allegations', List())
      .map(getMixedReferralAllegations)
    return fromJS({
      county: county,
      dateRange: dateRangeFormatter(referral.toJS()),
      notification: accessDescription(limitedAccessCode),
      peopleAndRoles: peopleAndRoles,
      referralLegacyId: referral.getIn(['legacy_descriptor', 'legacy_id']),
      referralId: referral.getIn(['legacy_descriptor', 'legacy_ui_id']),
      reporter: nameFormatter({name_default: '', ...referral.get('reporter', Map()).toJS()}),
      status: status,
      worker: nameFormatter({name_default: '', ...referral.get('assigned_social_worker', Map()).toJS()}),
    })
  })
)

const getScreeningsSelector = createSelector(
  getHistoryOfInvolvementsSelector,
  (hoi) => hoi.get('screenings', List())
)

const getScreeningCountyAndWorker = (screening) => ({
  county: screening.getIn(['county', 'description'], ''),
  worker: nameFormatter({name_default: '', ...screening.get('assigned_social_worker', Map()).toJS()}),
})

export const getFormattedScreeningsSelector = createSelector(
  getScreeningsSelector,
  (screenings) => screenings.map((screening) => {
    const notJustReporters = screening.get('all_people', List()).filter((person) => {
      const roles = person.get('roles', List())
      return roles.isEmpty() || hasNonReporter(roles)
    })
    const {county, worker} = getScreeningCountyAndWorker(screening)
    return fromJS({
      county,
      dateRange: dateRangeFormatter(screening.toJS()),
      people: notJustReporters.map((person) => nameFormatter(person.toJS())).join(', '),
      reporter: nameFormatter({name_default: '', ...screening.get('reporter', Map()).toJS()}),
      status: screening.get('end_date') ? 'Closed' : 'In Progress',
      worker,
    })
  })
)

export const getScreeningsCountSelector = createSelector(
  getScreeningsSelector,
  (screenings) => screenings.size
)

export const getHistoryIsEmptySelector = createSelector(
  getCasesSelector,
  getReferralsSelector,
  getScreeningsSelector,
  (cases, referrals, screenings) => List([cases, referrals, screenings]).every((involvement) => involvement.isEmpty())
)
