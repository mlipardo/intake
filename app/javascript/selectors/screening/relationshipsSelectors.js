import {createSelector} from 'reselect'
import {Map, List} from 'immutable'
import nameFormatter from 'utils/nameFormatter'
import {dateFormatter} from 'utils/dateFormatter'
import {ageFormatter} from 'utils/ageFormatter'
import {selectParticipants} from 'selectors/participantSelectors'
import {systemCodeDisplayValue, selectRelationshipTypes} from 'selectors/systemCodeSelectors'
import GENDERS, {GENDERS_LEGACY, GENDER_CODES} from 'enums/Genders'

export const getScreeningRelationships = (state) => (state.get('relationships', List()))

export const genderMap = (gender) => GENDERS_LEGACY[gender] || GENDERS[gender] || ''
const mapGenderCode = (gender) => GENDER_CODES[gender] || ''
const isPersonCardExists = (people, relationship) => {
  if (people && people.size > 0 && relationship.legacy_descriptor) {
    const isLegacyIdSame = people.some((person) => person.get('legacy_id') === relationship.legacy_descriptor.legacy_id)
    return !isLegacyIdSame
  }
  return true
}

export const getRelationshipsButtonStatus = (state) => (state.get('relationshipsButtonStatus'))

export const getPeopleSelector = createSelector(
  selectParticipants,
  getScreeningRelationships,
  selectRelationshipTypes,
  (participants, people, relationshipTypes) => people.map((person) => Map({
    dateOfBirth: dateFormatter(person.get('date_of_birth')),
    legacy_id: person.get('legacy_id'),
    id: person.get('id'),
    name: nameFormatter({...person.toJS()}),
    gender: genderMap(person.get('gender')),
    gender_code: mapGenderCode(person.get('gender')),
    age: ageFormatter({
      age: person.get('age'),
      ageUnit: person.get('age_unit'),
    }),
    relationships: person.get('relationships', List()).map((relationship) => (
      Map({
        absent_parent_code: relationship.get('absent_parent_code'),
        dateOfBirth: dateFormatter(relationship.get('related_person_date_of_birth')),
        gender: genderMap(relationship.get('related_person_gender')),
        gender_code: mapGenderCode(relationship.get('related_person_gender')),
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
        relationshipId: relationship.get('relationship_id'),
        relativeId: relationship.get('related_person_id'),
        secondaryRelationship: systemCodeDisplayValue(relationship.get('related_person_relationship'), relationshipTypes),
        person_card_exists: isPersonCardExists(participants, relationship.toJS()),
        reversed: relationship.get('reversed'),
        same_home_code: relationship.get('same_home_code'),
      })
    )),
  }))
)
