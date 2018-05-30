import addressTypes from 'reducers/systemCodes/addressTypesReducer'
import allegationsForm from 'reducers/allegationsFormReducer'
import allegationTypes from 'reducers/systemCodes/allegationTypesReducer'
import communicationMethods from 'reducers/systemCodes/communicationMethodsReducer'
import counties from 'reducers/systemCodes/countiesReducer'
import addressCounties from 'reducers/systemCodes/addressCountiesReducer'
import countyAgencies from 'reducers/systemCodes/countyAgenciesReducer'
import crossReportForm from 'reducers/crossReportFormReducer'
import errors from 'reducers/errorsReducer'
import incidentInformationForm from 'reducers/incidentInformationFormReducer'
import involvements from 'reducers/involvementsReducer'
import languages from 'reducers/systemCodes/languagesReducer'
import locations from 'reducers/systemCodes/locationsReducer'
import unableToDetermineCodes from 'reducers/systemCodes/unableToDetermineCodesReducer'
import hispanicOriginCodes from 'reducers/systemCodes/hispanicOriginCodesReducer'
import ethnicityTypes from 'reducers/systemCodes/ethnicityTypesReducer'
import raceTypes from 'reducers/systemCodes/raceTypesReducer'
import narrativeForm from 'reducers/narrativeFormReducer'
import pendingParticipants from 'reducers/pendingParticipantsReducer'
import participants from 'reducers/participantsReducer'
import peopleForm from 'reducers/peopleFormReducer'
import peopleSearch from 'reducers/peopleSearchReducer'
import relationships from 'reducers/relationshipsReducer'
import relationshipTypes from 'reducers/systemCodes/relationshipTypesReducer'
import routing from 'reducers/routerReducer'
import safelySurrenderedBaby from 'reducers/safelySurrenderedBabyReducer'
import screening from 'reducers/screeningReducer'
import screeningInformationForm from 'reducers/screeningInformationFormReducer'
import screeningDecisionForm from 'reducers/screeningDecisionFormReducer'
import screenings from 'reducers/screeningsReducer'
import screeningPage from 'reducers/screeningPageReducer'
import snapshot from 'reducers/snapshotReducer'
import staff from 'reducers/staffReducer'
import screenResponseTimes from 'reducers/systemCodes/screenResponseTimesReducer'
import workerSafetyForm from 'reducers/workerSafetyFormReducer'
import {combineReducers} from 'redux-immutable'
import userInfo from 'reducers/userInfoReducer'
import usStates from 'reducers/systemCodes/usStatesReducer'

const rootReducer = combineReducers({
  addressTypes,
  allegationsForm,
  allegationTypes,
  communicationMethods,
  counties,
  addressCounties,
  countyAgencies,
  crossReportForm,
  errors,
  ethnicityTypes,
  raceTypes,
  incidentInformationForm,
  involvements,
  languages,
  locations,
  unableToDetermineCodes,
  hispanicOriginCodes,
  narrativeForm,
  participants,
  pendingParticipants,
  peopleForm,
  peopleSearch,
  relationships,
  relationshipTypes,
  routing,
  safelySurrenderedBaby,
  screening,
  screeningInformationForm,
  screeningDecisionForm,
  screenings,
  screeningPage,
  snapshot,
  staff,
  screenResponseTimes,
  workerSafetyForm,
  userInfo,
  usStates,
})

export default rootReducer
