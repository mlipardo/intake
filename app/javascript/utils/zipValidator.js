import {List} from 'immutable'

const VALID_ZIP_LENGTH = 5
export const getZIPErrors = (zip) => {
  if (zip && zip.length === VALID_ZIP_LENGTH) {
    return List()
  }
  return ['zip code should be 5 digits']
}