import {takeEvery, call, put, select} from 'redux-saga/effects'
import {setAllegationTypes} from 'actions/allegationsFormActions'
import {
  createPersonFailure,
  createPersonSuccess,
} from 'actions/personCardActions'
import {GENERATE_BABY_DOE} from 'actions/safelySurrenderedBabyActions'
import {
  saveCard,
  saveFailure,
  saveFailureFromNoParticipants,
  saveSuccess,
} from 'actions/screeningActions'
import {cardName as allegationsCardName} from 'containers/screenings/AllegationsFormContainer'
import {babyDoe, caretakerDoe} from 'data/participants'
import {quietlySaveScreeningCard} from 'sagas/saveScreeningCardSaga'
import {
  getScreeningWithEditsSelector as getScreeningWithScreeningInformationEditsSelector,
} from 'selectors/screening/screeningInformationFormSelectors'
import * as http from 'utils/http'
import {
  createScreeningSuccess,
  createScreeningFailure,
} from 'actions/screeningActions'
import {replace} from 'react-router-redux'

let idNew

function* createScreeningBase(screening) {
  try {
    const response = yield call(http.post, '/api/v1/screenings', {screening: screening.toJS()})
    idNew = response.id
    const screeningEditPath = `/screenings/${idNew}/edit`
    yield put(createScreeningSuccess(response))
    yield put(replace(screeningEditPath))
  } catch (error) {
    yield put(createScreeningFailure(error))
  }
}

function* createBabyAndCaretaker(screening_id, idNew) {
  try {
    const baby = yield call(http.post, '/api/v1/participants', {
      participant: {
        screening_id: screening_id || idNew,
        ...babyDoe,
      },
    })
    yield put(createPersonSuccess(baby))
    const caretaker = yield call(http.post, '/api/v1/participants', {
      participant: {
        screening_id: screening_id || idNew,
        ...caretakerDoe,
      },
    })
    yield put(createPersonSuccess(caretaker))

    yield put.resolve(setAllegationTypes({
      victimId: baby.id,
      perpetratorId: caretaker.id,
      allegationTypes: ['Caretaker absent/incapacity'],
    }))
    const response = yield* quietlySaveScreeningCard(saveCard(allegationsCardName))
    yield put(saveSuccess(response))
  } catch (error) {
    yield put(createPersonFailure(error && error.responseJSON))
  }
}

export function* generateBabyDoe({payload: screening_id}) {
  try {
    const screening = yield select(getScreeningWithScreeningInformationEditsSelector)
    if (screening.get('participants') === undefined) {
      yield put(saveFailureFromNoParticipants())
      return
    }
    const id = screening.get('id')
    if (id) {
      const path = `/api/v1/screenings/${id}`
      const response = yield call(http.put, path, {screening: screening.toJS()})
      yield put(saveSuccess(response))
    } else {
      yield* createScreeningBase(screening)
    }
  } catch (error) {
    yield put(saveFailure(error && error.responseJSON))
    return
  }

  yield* createBabyAndCaretaker(screening_id, idNew)
}

export function* generateBabyDoeSaga() {
  yield takeEvery(GENERATE_BABY_DOE, generateBabyDoe)
}
