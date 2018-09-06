import {RELATIONSHIP_TYPES} from 'enums/RelationshipTypes'
import moment from 'moment'

const MALE_CODES = ['M', 'm', 'U']
const FEMALE_CODES = ['F', 'f', 'U']
const YOUNGER_CODES = ['f', 'm']
const PRIMARY = 0
const SECONDARY = 1

const isCompatible = (index, codes, type) => codes.includes(type.gender_code[index])

const isOlder = (clientA, clientB) =>
  clientA.dateOfBirth && clientB.dateOfBirth &&
  moment(clientA.dateOfBirth, 'MM/DD/YYYY') < moment(clientB.dateOfBirth, 'MM/DD/YYYY')

const areGendersCompatible = (client, index) => (type) =>
  (isCompatible(index, MALE_CODES, type) || client.gender_code !== 'M') &&
  (isCompatible(index, FEMALE_CODES, type) || client.gender_code !== 'F')

const areAgesCompatible = (primaryClient, secondaryClient) => (type) =>
  !(isCompatible(PRIMARY, YOUNGER_CODES, type) && isOlder(primaryClient, secondaryClient)) &&
  !(isCompatible(SECONDARY, YOUNGER_CODES, type) && isOlder(secondaryClient, primaryClient))

const relationshipDropdown = (primaryClient, secondaryClient) =>
  RELATIONSHIP_TYPES
    .filter(areGendersCompatible(primaryClient, PRIMARY))
    .filter(areGendersCompatible(secondaryClient, SECONDARY))
    .filter(areAgesCompatible(primaryClient, secondaryClient))

export default relationshipDropdown
