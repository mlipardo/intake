import {fromJS} from 'immutable'
import {CLEAR_ERRORS} from 'actions/clearErrors'

const initialState = fromJS({})

export const PROCESS_ERROR = 'The application encountered an error and could not process it'
export const PROCESS_TYPE = 'PROCESS_TYPE'

export default function errorsReducer(state = initialState, action) {
  try {
    const {payload, error, type} = action

    if (error) {
      const {error: errorPayload} = payload
      const {responseJSON} = errorPayload
      const {api_response_body: {issue_details} = {}} = responseJSON || errorPayload
      return state.set(type, fromJS(issue_details))
    }

    if (type === CLEAR_ERRORS) {
      return initialState
    }

    return state.delete(type)
  } catch (error) {
    return state.set(PROCESS_TYPE, fromJS({error: [PROCESS_ERROR]}))
  }
}
