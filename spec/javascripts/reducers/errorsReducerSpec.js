import {fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import errorsReducer from 'reducers/errorsReducer'
import {SUBMIT_SCREENING_COMPLETE} from 'actions/actionTypes'
import {PROCESS_TYPE} from 'reducers/errorsReducer'

describe('errorsReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on error', () => {
    it('sets errors when there is a response JSON', () => {
      const state = fromJS({})
      const action = {
        payload: {error: {responseJSON: {api_response_body: {issue_details: {
          incident_id: '0de2aea9-04f9-4fc4-bc16-75b6495839e0',
          type: 'constraint_validation',
          user_message: 'a user message',
          property: 'approvalStatus',
          invalid_value: 0,
        }}}}},
        type: SUBMIT_SCREENING_COMPLETE,
        error: true,
      }
      expect(errorsReducer(state, action)).toEqualImmutable(
        fromJS({
          [SUBMIT_SCREENING_COMPLETE]: {
            incident_id: '0de2aea9-04f9-4fc4-bc16-75b6495839e0',
            type: 'constraint_validation',
            user_message: 'a user message',
            property: 'approvalStatus',
            invalid_value: 0,
          },
        })
      )
    })
    it('sets errors when there is no response JSON', () => {
      const state = fromJS({})
      const action = {
        payload: {error: {api_response_body: {issue_details: {
          incident_id: '0de2aea9-04f9-4fc4-bc16-75b6495839e0',
          type: 'constraint_validation',
          user_message: 'a user message',
          property: 'approvalStatus',
          invalid_value: 0,
        }}}},
        type: SUBMIT_SCREENING_COMPLETE,
        error: true,
      }
      expect(errorsReducer(state, action)).toEqualImmutable(
        fromJS({
          [SUBMIT_SCREENING_COMPLETE]: {
            incident_id: '0de2aea9-04f9-4fc4-bc16-75b6495839e0',
            type: 'constraint_validation',
            user_message: 'a user message',
            property: 'approvalStatus',
            invalid_value: 0,
          },
        })
      )
    })

    it('sets an anonymous error in the store when it cannot process the error message', () => {
      const state = fromJS({})
      const action = {
        payload: {asdf: 'asdf'},
        error: true,
      }
      expect(errorsReducer(state, action)).toEqualImmutable(
        fromJS({
          [PROCESS_TYPE]: {
            error: ['The application encountered an error and could not process it'],
          },
        })
      )
    })
  })

  describe('on errors for SUBMIT_SCREENING_COMPLETE', () => {
    it('stores the list of issue_details', () => {
      const state = fromJS({})
      const action = {
        payload: {error: {responseJSON: {api_response_body: {issue_details: [
          {
            incident_id: '0de2aea9-04f9-4fc4-bc16-75b6495839e0',
            type: 'constraint_validation',
            user_message: 'may not be empty',
            property: 'screeningDecision',
          },
          {
            incident_id: '0de2aea9-04f9-4fc4-bc16-75b6495839e0',
            type: 'constraint_validation',
            user_message: 'must be a valid system code for category APV_STC',
            property: 'approvalStatus',
            invalid_value: 0,
          },
        ]}}}},
        type: SUBMIT_SCREENING_COMPLETE,
        error: true,
      }
      expect(errorsReducer(state, action)).toEqualImmutable(
        fromJS({
          [SUBMIT_SCREENING_COMPLETE]: [
            {
              incident_id: '0de2aea9-04f9-4fc4-bc16-75b6495839e0',
              type: 'constraint_validation',
              user_message: 'may not be empty',
              property: 'screeningDecision',
            },
            {
              incident_id: '0de2aea9-04f9-4fc4-bc16-75b6495839e0',
              type: 'constraint_validation',
              user_message: 'must be a valid system code for category APV_STC',
              property: 'approvalStatus',
              invalid_value: 0,
            },
          ],
        })
      )
    })
  })
  it('resets the state to initial state if error store is empty/undefined', () => {
    const state = fromJS({})
    const action = {
      payload: 'none',
      type: 'FETCH_SCREENINGS',
    }
    expect(errorsReducer(state, action)).toEqualImmutable(
      fromJS({})
    )
  })
  describe('generic action type', () => {
    describe('on error', () => {
      it('updates error store for the type', () => {
        const state = fromJS({
          ACTION_TYPE: 'Did not have a plan',
        })
        const action = {
          payload: 'Did not have a plan',
          type: 'GENERIC_ACTION_COMPLETE',
          error: true,
        }
        expect(errorsReducer(state, action)).toEqualImmutable(
          fromJS({
            ACTION_TYPE: 'Did not have a plan',
            PROCESS_TYPE: {error: ['The application encountered an error and could not process it']},
          })
        )
      })
    })

    describe('on success', () => {
      it('does not fail if success and no previous errors', () => {
        const state = fromJS({})
        const action = {
          payload: 'Did have a plan',
          type: 'GENERIC_ACTION_COMPLETE',
          error: false,
        }
        expect(errorsReducer(state, action)).toEqualImmutable(
          fromJS({})
        )
      })
      it('resets the error store for the type', () => {
        const state = fromJS({
          ACTION_TYPE: 'Did not have a plan',
          GENERIC_ACTION_COMPLETE: 'Did not have a plan',
        })
        const action = {
          payload: 'Did have a plan',
          type: 'GENERIC_ACTION_COMPLETE',
          error: false,
        }
        expect(errorsReducer(state, action)).toEqualImmutable(
          fromJS({
            ACTION_TYPE: 'Did not have a plan',
          })
        )
      })
    })
  })
})
