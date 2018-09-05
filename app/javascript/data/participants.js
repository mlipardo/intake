import {
  PARENT_RELATION,
  GIVEN_BRACELET_UNKNOWN,
  GIVEN_MED_QUESTIONAIRE_UNKNOWN,
} from 'enums/SafelySurrenderedBabyEnums'

export const babyDoe = {
  first_name: 'Baby',
  last_name: 'Doe',
  sealed: false,
  sensitive: false,
  roles: ['Victim'],
  safely_surrendered_babies: {
    surrendered_by: 'Unknown Doe',
    relation_to_child: PARENT_RELATION,
    parent_guardian_given_bracelet_id: GIVEN_BRACELET_UNKNOWN,
    parent_guardian_provided_med_questionaire: GIVEN_MED_QUESTIONAIRE_UNKNOWN,
  },
}

export const caretakerDoe = {
  approximate_age: '0',
  approximate_age_units: 'days',
  first_name: 'Unknown',
  last_name: 'Doe',
  sealed: false,
  sensitive: false,
  roles: ['Perpetrator'],
}
