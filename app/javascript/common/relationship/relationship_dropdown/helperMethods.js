import moment from 'moment'
export const unknownGenderCodes = ['U', 'I']
export const uniq = (arr) => [...new Set(arr)]
export const isPrimaryClientYounger = (
  primaryClientBirthDate,
  secondaryClientBirthDate) => primaryClientBirthDate > secondaryClientBirthDate

export const isSecondaryClientYounger = (
  primaryClientBirthDate,
  secondaryClientBirthDate) => primaryClientBirthDate < secondaryClientBirthDate

export const formatClientBirthDate = (clientBirthDate) => moment(clientBirthDate, 'MM/DD/YYYY')

export const getClientBirthDate = (client) => formatClientBirthDate(client.dateOfBirth)

export const doesClientHaveDOB = (client) => {
  const clientBirthDate = formatClientBirthDate(getClientBirthDate(client))
  return !isNaN(clientBirthDate)
}

export const isGenderUnknown = (client) => unknownGenderCodes.includes(client.gender_code)

export const whenBothHaveDOBandGender = (
  primaryClient,
  secondaryClient,
  primaryClientIsYounger,
  secondaryClientIsYounger
) => {
  let combinedGenderCodeBirthDate

  if (primaryClientIsYounger) {
    combinedGenderCodeBirthDate =
      primaryClient.gender_code.toLowerCase() + secondaryClient.gender_code
  }
  if (secondaryClientIsYounger) {
    combinedGenderCodeBirthDate =
      primaryClient.gender_code + secondaryClient.gender_code.toLowerCase()
  }
  return combinedGenderCodeBirthDate
}

export const whenBothHaveDOBnoGender = (
  primaryClientIsYounger,
  secondaryClientIsYounger
) => {
  const genderCodesToReturn = []
  if (primaryClientIsYounger) {
    genderCodesToReturn.push(
      'FM', 'FF', 'MM', 'MF', 'FU', 'UF', 'UM', 'MU', 'fM', 'fF', 'mM', 'mF'
    )
  } else if (secondaryClientIsYounger) {
    genderCodesToReturn.push(
      'FM', 'FF', 'MM', 'MF', 'FU', 'UF', 'UM', 'MU', 'Fm', 'Ff', 'Mm', 'Mf'
    )
  }
  genderCodesToReturn.push('UU')
  return genderCodesToReturn
}

export const whenBothHaveDOBnoSecndryGender = (
  primaryClient,
  primaryClientIsYounger,
  secondaryClientIsYounger
) => {
  const genderCodesToReturn = []
  if (primaryClientIsYounger) {
    genderCodesToReturn.push(
      `${primaryClient.gender_code.toLowerCase()}M`,
      `${primaryClient.gender_code.toLowerCase()}F`,
      `${primaryClient.gender_code}M`,
      `${primaryClient.gender_code}F`
    )
  }
  if (secondaryClientIsYounger) {
    genderCodesToReturn.push(
      `${primaryClient.gender_code}M`,
      `${primaryClient.gender_code}F`,
      `${primaryClient.gender_code}m`,
      `${primaryClient.gender_code}f`
    )
  }
  genderCodesToReturn.push('UF', 'UM')
  return genderCodesToReturn
}

export const whenBothHaveDOBnoPrmaryGender = (
  secondaryClient,
  primaryClientIsYounger,
  secondaryClientIsYounger
) => {
  const genderCodesToReturn = []
  if (primaryClientIsYounger) {
    genderCodesToReturn.push(
      `m${secondaryClient.gender_code}`,
      `f${secondaryClient.gender_code}`,
      `M${secondaryClient.gender_code}`,
      `F${secondaryClient.gender_code}`
    )
  }
  if (secondaryClientIsYounger) {
    genderCodesToReturn.push(
      `M${secondaryClient.gender_code}`,
      `F${secondaryClient.gender_code}`,
      `M${secondaryClient.gender_code.toLowerCase()}`,
      `F${secondaryClient.gender_code.toLowerCase()}`
    )
  }
  genderCodesToReturn.push('FU', 'MU')
  return genderCodesToReturn
}
