import {fromJS} from 'immutable'
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
import {
  generateBabyDoe,
  generateBabyDoeSaga,
} from 'sagas/generateBabyDoeSaga'
import * as SaveScreeningCardSagas from 'sagas/saveScreeningCardSaga'
import {
  getScreeningWithEditsSelector as getScreeningWithScreeningInformationEditsSelector,
} from 'selectors/screening/screeningInformationFormSelectors'
import * as http from 'utils/http'

describe('generateBabyDoeSaga', () => {
  it('triggers SSB info creation on GENERATE_BABY_DOE', () => {
    const gen = generateBabyDoeSaga()
    expect(gen.next().value).toEqual(takeEvery(GENERATE_BABY_DOE, generateBabyDoe))
  })
})

describe('triggerSSB', () => {
  const screening_id = '1'

  const screening = {
    id: screening_id,
    report_type: 'ssb',
    participants: [],
  }

  const saveScreening = (gen) => {
    gen.next()
    gen.next(fromJS(screening))
    gen.next(screening)
  }

  it('adds Baby Doe and Caretaker Doe', () => {
    spyOn(SaveScreeningCardSagas, 'quietlySaveScreeningCard')
    const gen = generateBabyDoe({payload: screening_id})
    expect(gen.next().value).toEqual(select(getScreeningWithScreeningInformationEditsSelector))
    expect(gen.next(fromJS(screening)).value).toEqual(call(http.put, '/api/v1/screenings/1', {screening}))
    expect(gen.next('response').value).toEqual(put(saveSuccess('response')))
    expect(gen.next().value).toEqual(call(http.post, '/api/v1/participants', {
      participant: {
        screening_id,
        ...babyDoe,
      },
    }))

    const babyResponse = {id: '111'}
    const putBaby = gen.next(babyResponse)

    expect(putBaby.value).toEqual(put(createPersonSuccess(babyResponse)))

    expect(gen.next().value).toEqual(call(http.post, '/api/v1/participants', {
      participant: {
        screening_id,
        ...caretakerDoe,
      },
    }))

    const caretakerResponse = {id: '222'}
    const putCaretaker = gen.next(caretakerResponse)

    expect(putCaretaker.value).toEqual(put(createPersonSuccess(caretakerResponse)))

    expect(gen.next().value).toEqual(put.resolve(setAllegationTypes({
      victimId: '111',
      perpetratorId: '222',
      allegationTypes: ['Caretaker absent/incapacity'],
    })))
    gen.next()
    expect(
      SaveScreeningCardSagas.quietlySaveScreeningCard
    ).toHaveBeenCalledWith(saveCard(allegationsCardName))
  })

  it('puts createPersonFailure when Baby Doe fails', () => {
    const gen = generateBabyDoe({payload: screening_id})
    saveScreening(gen)
    gen.next()

    const error = {responseJSON: 'some error'}
    expect(gen.throw(error).value).toEqual(put(createPersonFailure('some error')))
  })

  it('puts createPersonFailure when Caretaker Doe fails', () => {
    const gen = generateBabyDoe({payload: screening_id})
    saveScreening(gen)
    gen.next()
    gen.next({id: '111'})
    gen.next()

    const error = {responseJSON: 'some error'}
    expect(gen.throw(error).value).toEqual(put(createPersonFailure('some error')))
  })

  it('puts saveFailure when saving the screening type fails', () => {
    const gen = generateBabyDoe({payload: screening_id})
    gen.next()
    gen.next(fromJS(screening))
    const error = {responseJSON: 'some error'}
    expect(gen.throw(error).value).toEqual(put(saveFailure('some error')))
    expect(gen.next().done).toEqual(true)
  })

  it('puts saveFailure when saving the screening with undefined participants', () => {
    const gen = generateBabyDoe({payload: screening_id})
    gen.next()
    const result = gen.next(fromJS({
      id: screening_id,
      report_type: 'ssb',
    }))
    expect(result.value).toEqual(put(saveFailureFromNoParticipants()))
    expect(gen.next().done).toEqual(true)
  })
})
