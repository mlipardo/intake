import {takeLatest, put, call, select} from 'redux-saga/effects'
import {BATCH_CREATE_RELATIONSHIPS} from 'actions/relationshipsActions'
import {batchCreateRelationshipsSuccess,batchCreateRelationshipsFaliure} from 'actions/relationshipsActions'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import {selectClientIds} from 'selectors/participantSelectors'
import {fetchRelationships} from 'actions/relationshipsActions'
import {post} from 'utils/http'


export function* batchCreateRelationships({payload: relationships}){
  try{ 
    const create_relationships_url = '/api/v1/relationships'
    const response = yield call(post, create_relationships_url, relationships)
    yield put( batchCreateRelationshipsSuccess(response))
    const clientIds = [] 
    const screeningId = yield select(getScreeningIdValueSelector)
    yield put(fetchRelationships(clientIds, screeningId))
  }
  catch(error){
    yield put(batchCreateRelationshipsFaliure(error))
  }
}


export function* createRelationshipsSaga(){
  yield takeLatest(BATCH_CREATE_RELATIONSHIPS, batchCreateRelationships)
}