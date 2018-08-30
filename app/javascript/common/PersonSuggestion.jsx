import AddressInfo from 'common/AddressInfo'
import AgeInfo from 'common/AgeInfo'
import GenderRaceAndEthnicity from 'common/GenderRaceAndEthnicity'
import Languages from 'common/LanguageInfo'
import PropTypes from 'prop-types'
import React from 'react'
import PhoneNumberInfo from 'common/PhoneNumberInfo'
import legacySourceFormatter from 'utils/legacySourceFormatter'
import sanitizeHtml from 'sanitize-html'
import AvatarImg from '../../assets/images/default-profile.svg'

const PersonSuggestion = ({
  fullName, dateOfBirth, isDeceased, gender, languages, races, ethnicity, ssn,
  address, phoneNumber, legacyDescriptor, isSensitive, isSealed, isProbationYouth,
}) => {
  const sanitizedField = (field) => ({
    dangerouslySetInnerHTML: {
      __html: sanitizeHtml(field, {allowedTags: ['em']}),
    },
  })

  const legacySourceString = legacySourceFormatter(legacyDescriptor || {})

  return (
    <div className='row'>
      <div className='col-md-2 profile-picture'>
        <img src={AvatarImg} alt='Avatar' />
        {isSensitive && <div className='information-flag image-caption'>Sensitive</div>}
        {isSealed && <div className='information-flag image-caption'>Sealed</div>}
      </div>
      <div className='col-md-10'>
        <div className='row'>
          <div className='col-md-12'>
            <strong className='highlighted' {...sanitizedField(fullName)} />
            {isDeceased && <span className='information-flag search-result'>Deceased</span>}
            {isProbationYouth && <span className='information-flag search-result'>Probation Youth</span>}
            <div>{legacySourceString}</div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <GenderRaceAndEthnicity gender={gender} races={races} ethnicity={ethnicity} />
            <AgeInfo dateOfBirth={dateOfBirth} />
            <Languages languages={languages} />
            {
              ssn && <div>
                <strong className='c-gray half-pad-right'>SSN</strong>
                <span className='highlighted' {...sanitizedField(ssn)} />
              </div>
            }
          </div>
          <div className='col-md-6'>
            {address && <AddressInfo {...address} /> }
            {phoneNumber && <PhoneNumberInfo {...phoneNumber} />}
          </div>
        </div>
      </div>
    </div>
  )
}

PersonSuggestion.propTypes = {
  address: PropTypes.object,
  dateOfBirth: PropTypes.string,
  ethnicity: PropTypes.object,
  fullName: PropTypes.string,
  gender: PropTypes.string,
  isDeceased: PropTypes.bool,
  isProbationYouth: PropTypes.bool,
  isSealed: PropTypes.bool,
  isSensitive: PropTypes.bool,
  languages: PropTypes.array,
  legacyDescriptor: PropTypes.object,
  phoneNumber: PropTypes.object,
  races: PropTypes.array,
  ssn: PropTypes.string,
}

export default PersonSuggestion
