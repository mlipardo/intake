import PersonCardContainer from 'containers/screenings/PersonCardContainer'
import PersonCSECFormContainer from 'containers/screenings/PersonCSECFormContainer'
import PersonDemographicsFormContainer from 'containers/screenings/PersonDemographicsFormContainer'
import PersonRaceFormContainer from 'containers/screenings/PersonRaceFormContainer'
import PersonEthnicityFormContainer from 'containers/screenings/PersonEthnicityFormContainer'
import PersonPhoneNumbersContainer from 'containers/screenings/PersonPhoneNumbersContainer'
import PersonPhoneNumbersFormContainer from 'containers/screenings/PersonPhoneNumbersFormContainer'
import PersonShowContainer from 'containers/screenings/PersonShowContainer'
import PersonAddressesContainer from 'containers/screenings/PersonAddressesContainer'
import PersonReadOnlyAddressesContainer from 'containers/screenings/PersonReadOnlyAddressesContainer'
import PersonAddressesFormContainer from 'containers/screenings/PersonAddressesFormContainer'
import PersonFormContainer from 'containers/screenings/PersonFormContainer'
import SafelySurrenderedBabyFormContainer from 'containers/screenings/SafelySurrenderedBabyFormContainer'
import SafelySurrenderedBabyShowContainer from 'containers/screenings/SafelySurrenderedBabyShowContainer'
import PropTypes from 'prop-types'
import React from 'react'

const PersonCardView = ({personId}) => (
  <PersonCardContainer
    personId={personId}
    edit={
      <div>
        <PersonFormContainer personId={personId} />
        <PersonDemographicsFormContainer personId={personId} />
        <PersonRaceFormContainer personId={personId} />
        <PersonEthnicityFormContainer personId={personId} />
        <PersonPhoneNumbersFormContainer personId={personId} />
        <PersonReadOnlyAddressesContainer personId={personId} />
        <PersonAddressesFormContainer personId={personId} />
        <PersonCSECFormContainer personId={personId} />
        <SafelySurrenderedBabyFormContainer personId={personId} />
      </div>
    }
    show={
      <div>
        <PersonShowContainer personId={personId} />
        <PersonPhoneNumbersContainer personId={personId} />
        <PersonAddressesContainer personId={personId} />
        <SafelySurrenderedBabyShowContainer personId={personId} />
      </div>
    }
  />
)

PersonCardView.propTypes = {
  personId: PropTypes.string.isRequired,
}

export default PersonCardView
