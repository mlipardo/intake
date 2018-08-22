import {takeLatest, put, call, select} from 'redux-saga/effects'
import {BATCH_CREATE_RELATIONSHIPS} from 'actions/relationshipsActions'
import {batchCreateRelationshipsSuccess,batchCreateRelationshipsFaliure} from 'actions/relationshipsActions'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import {selectClientIds} from 'selectors/participantSelectors'
import {fetchRelationships} from 'actions/relationshipsActions'
import {post} from 'utils/http'


export function* batchCreateRelationships({payload: relationships}){
  try{ 
    console.log('inside batchCreateRelationships in saga')
    console.log(relationships)
    const create_relationships_url = '/api/v1/relationships'
    const response = yield call(post, create_relationships_url, relationships)
    yield put( batchCreateRelationshipsSuccess(response))
    const clientIds = [] //yield select(selectClientIds)
    const screeningId = yield select(getScreeningIdValueSelector)
    console.log('clientIds')
    console.log(clientIds)
    console.log('screeningId')
    console.log(screeningId)

    yield put(fetchRelationships(clientIds, screeningId))
  }
  catch(error){
    console.log('error')
    console.log(error)
    yield put(batchCreateRelationshipsFaliure(error))
  }
}


export function* createRelationshipsSaga(){
  yield takeLatest(BATCH_CREATE_RELATIONSHIPS, batchCreateRelationships)
}