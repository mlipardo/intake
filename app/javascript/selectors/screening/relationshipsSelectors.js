import {createSelector} from 'reselect'
import {Map, List} from 'immutable'
import nameFormatter from 'utils/nameFormatter'
import {dateFormatter} from 'utils/dateFormatter'
import {ageFormatter} from 'utils/ageFormatter'
import {selectParticipants} from 'selectors/participantSelectors'
import {systemCodeDisplayValue, selectRelationshipTypes} from 'selectors/systemCodeSelectors'

export const getScreeningRelationships = (state) => (state.get('relationships', List()))

const isPersonCardExists = (people, relationship) => {
  if (people && people.size > 0 && relationship.legacy_descriptor) {
    const isLegacyIdSame = people.some((person) => person.get('legacy_id') === relationship.legacy_descriptor.legacy_id)
    return !isLegacyIdSame
  }
  return true
}

const isPersonNewlyCreated = (participants, person) => {
  console.log(`inside isPersonNewlyCreate=====`)
  if (participants.size > 0 && person.id) {
    const personNewlyCreated = participants.some((participant) => { 
      console.log(`particiapnt.id: ${participant.get('id')}`)
      console.log(`person.id: ${person.id}`)
      console.log(`particiapnt.get('newly_created_person'): ${participant.get('newly_created_person')}`)
      return participant.get('id') === person.id && participant.get('newly_created_person') })
    return personNewlyCreated
  }
  return false
}



export const getPeopleSelector = createSelector(
  selectParticipants,
  getScreeningRelationships,
  selectRelationshipTypes,
  (participants, people, relationshipTypes) => people.map((person) => Map({
    id: person.get('id'),
    test: 'test',
    dateOfBirth: dateFormatter(person.get('date_of_birth')),
    legacy_id: person.get('legacy_id'),
    name: nameFormatter({...person.toJS()}),
    newly_created_person: isPersonNewlyCreated(participants, person.toJS()),
    // legacy_descriptor: person.get('legacy_descriptor').toJS(),
    gender: person.get('gender') || '',
    age: ageFormatter({
      age: person.get('age'),
      ageUnit: person.get('age_unit'),
    }),
    relationships: person.get('relationships', List()).map((relationship) => (
      Map({
        absent_parent_code: relationship.get('absent_parent_code'),
        dateOfBirth: dateFormatter(relationship.get('related_person_date_of_birth')),
        gender: relationship.get('related_person_gender'),
        name: nameFormatter({
          first_name: relationship.get('related_person_first_name'),
          last_name: relationship.get('related_person_last_name'),
          middle_name: relationship.get('related_person_middle_name'),
          name_suffix: relationship.get('related_person_name_suffix'),
        }),
        legacy_descriptor: relationship.get('legacy_descriptor'),
        type: systemCodeDisplayValue(relationship.get('indexed_person_relationship'), relationshipTypes),
        type_code: relationship.get('indexed_person_relationship'),
        age: ageFormatter({
          age: relationship.get('related_person_age'),
          ageUnit: relationship.get('related_person_age_unit'),
        }),
        secondaryRelationship: systemCodeDisplayValue(relationship.get('related_person_relationship'), relationshipTypes),
        person_card_exists: isPersonCardExists(participants, relationship.toJS()),
        same_home_code: relationship.get('same_home_code'),
      })
    )),
  }))
)
