import allegationsForm from 'reducers/allegationsFormReducer'
import candidatesForm from 'reducers/candidatesFormReducer'
import crossReportForm from 'reducers/crossReportFormReducer'
import errors from 'reducers/errorsReducer'
import incidentInformationForm from 'reducers/incidentInformationFormReducer'
import involvements from 'reducers/involvementsReducer'
import narrativeForm from 'reducers/narrativeFormReducer'
import pendingParticipants from 'reducers/pendingParticipantsReducer'
import participants from 'reducers/participantsReducer'
import peopleForm from 'reducers/peopleFormReducer'
import peopleSearch from 'reducers/peopleSearchReducer'
import relationship from 'reducers/relationshipReducer'
import relationships from 'reducers/relationshipsReducer'
import relationshipsQueryCycleTime from 'reducers/relationshipsQueryCycleTimeReducer'
import routing from 'reducers/routerReducer'
import safelySurrenderedBaby from 'reducers/safelySurrenderedBabyReducer'
import screening from 'reducers/screeningReducer'
import screeningInformationForm from 'reducers/screeningInformationFormReducer'
import screeningDecisionForm from 'reducers/screeningDecisionFormReducer'
import screenings from 'reducers/screeningsReducer'
import screeningPage from 'reducers/screeningPageReducer'
import snapshot from 'reducers/snapshotReducer'
import staff from 'reducers/staffReducer'
import workerSafetyForm from 'reducers/workerSafetyFormReducer'
import {combineReducers} from 'redux-immutable'
import userInfo from 'reducers/userInfoReducer'
import systemCodes from 'reducers/systemCodes'

const rootReducer = combineReducers({
  allegationsForm,
  candidatesForm,
  crossReportForm,
  errors,
  incidentInformationForm,
  involvements,
  narrativeForm,
  participants,
  pendingParticipants,
  peopleForm,
  peopleSearch,
  relationship,
  relationships,
  relationshipsQueryCycleTime,
  routing,
  safelySurrenderedBaby,
  screening,
  screeningInformationForm,
  screeningDecisionForm,
  screenings,
  screeningPage,
  snapshot,
  staff,
  systemCodes,
  workerSafetyForm,
  userInfo,
})

export default rootReducer
