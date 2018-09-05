/*
  This enum is a subset of all relationship types. Ideally, it should be served
  from an LOV service, rather than hardcoded here. For the time being, however,
  our relationship types are not stored in a way where we can easily select this
  subset (i.e. with a subcategory). So, for now we hardcode them and plan to
  circle back on this tech debt.
  https://osi-cwds.atlassian.net/browse/HOT-2016
*/
export const RELATIONS = Object.freeze({
  1592: 'Parents',
  1593: 'Mother (Birth or Adoptive)',
  1594: 'Father (Birth or Adoptive)',
  1595: 'Legal Guardian',
  1596: 'Grandparents',
  1597: 'Grandmother',
  1598: 'Grandfather',
  1599: 'Sister',
  1600: 'Brother',
  1601: 'Stepmother',
  1602: 'Stepfather',
  1603: 'Aunt',
  1604: 'Uncle',
  1605: 'Other Relative',
  1606: 'Indian Custodian',
  1607: 'Nonrelative',
  1608: 'Unable to Identify',
})

export const PARENT_RELATION = '1592'

export const GIVEN_BRACELET_RESPONSES = Object.freeze({
  U: 'Unknown',
  Y: 'Yes',
  N: 'No',
  A: 'Attempted',
})

export const GIVEN_BRACELET_UNKNOWN = 'U'

export const GIVEN_MED_QUESTIONAIRE_RESPONSES = Object.freeze({
  U: 'Unknown',
  R: 'Completed and Returned Immediately',
  M: 'Completed and Mailed Back',
  N: 'Provided/Never Returned',
  D: 'Declined',
})

export const GIVEN_MED_QUESTIONAIRE_UNKNOWN = 'U'
