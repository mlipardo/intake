import PropTypes from 'prop-types'
import React from 'react'
import DateField from 'common/DateField'
import InputField from 'common/InputField'
import SelectField from 'common/SelectField'
import TextAreaCount from 'common/TextAreaCount'
import CardActionRow from 'screenings/CardActionRow'

const IncidentInformationForm = ({incidentDate, errors, onChange, onBlur, address, usStates, selectedCounty, counties,
  selectedLocationType, locationTypes, locationOfChildren, onSave, onCancel}) => (
  <div className='card-body'>
    <div className='row'>
      <DateField
        gridClassName='col-md-4'
        id='incident-date'
        label='Incident Date'
        value={incidentDate}
        errors={errors.incident_date}
        onChange={(value) => onChange(['incident_date'], value)}
        onBlur={() => onBlur(['incident_date'])}
        hasTime={false}
      />
    </div>
    <fieldset className='double-gap-top'>
      <div className='row'>
        <div className='col-md-12'>
          <legend>Incident Address</legend>
        </div>
      </div>
      <div className='row'>
        <InputField
          gridClassName='col-md-4'
          id='incident-address-street'
          label='Address'
          maxLength='128'
          onBlur={() => onBlur(['incident_address', 'street_address'])}
          onChange={({target: {value}}) => onChange(['incident_address', 'street_address'], value)}
          value={address.streetAddress}
          errors={errors.incident_address.street_address}
          required={true}
        />
        <InputField
          gridClassName='col-md-4'
          id='incident-address-city'
          label= 'City'
          maxLength='64'
          onBlur={() => onBlur(['incident_address', 'city'])}
          onChange={({target: {value}}) => onChange(['incident_address', 'city'], value)}
          value={address.city}
          errors={errors.incident_address.city}
          required={true}
        />
        <SelectField
          disabled
          gridClassName='col-md-4'
          id='incident-address-county'
          label='Incident County'
          value={selectedCounty}
          onChange={({target: {value}}) => onChange(['incident_county'], value)}
        >
          <option key='' />
          {counties.map((county) => <option key={county.key} value={county.key}>{county.name}</option>)}
        </SelectField>
      </div>
      <div className='row'>
        <SelectField
          gridClassName='col-md-4'
          id='incident-address-state'
          label='State'
          value={address.state}
          onChange={({target: {value}}) => onChange(['incident_address', 'state'], value)}
        >
          <option key='' />
          {usStates.map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}
        </SelectField>
        <InputField
          allowCharacters={/[0-9]/}
          gridClassName='col-md-4'
          id='incident-address-zip'
          label='Zip'
          maxLength='5'
          onChange={({target: {value}}) => onChange(['incident_address', 'zip'], value)}
          value={address.zip}
        />
        <SelectField
          gridClassName='col-md-4'
          id='incident-address-type'
          label='Location Type'
          value={selectedLocationType}
          onChange={({target: {value}}) => onChange(['location_type'], value)}
        >
          <option key='' />
          {locationTypes.map((locationType) =>
            <optgroup label={locationType.name} key={locationType.name} value={locationType.name}>
              {locationType.locations.map((location) =>
                <option key={location} value={location}>{location}</option>)
              }
            </optgroup>
          )}
        </SelectField>
      </div>
    </fieldset>
    <div className='col-md-12'>
      <div className='row'>
        <label className='no-gap' htmlFor='current-location-of-children'>Location Of Children</label>
        <TextAreaCount
          id='current-location-of-children'
          onChange={({target: {value}}) => onChange(['current_location_of_children'], value)}
          value={locationOfChildren}
          maxLength='256'
        />
      </div>
    </div>
    <CardActionRow onCancel={onCancel} onSave={onSave} />
  </div>
)

IncidentInformationForm.propTypes = {
  address: PropTypes.shape({
    city: PropTypes.string,
    state: PropTypes.string,
    streetAddress: PropTypes.string,
    zip: PropTypes.string,
  }),
  counties: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    name: PropTypes.string,
  })),
  errors: PropTypes.shape({
    incident_date: PropTypes.arrayOf(PropTypes.string),
    incident_address: PropTypes.shape({
      street_address: PropTypes.array,
      city: PropTypes.array,
    }),
  }),
  incidentDate: PropTypes.string,
  locationOfChildren: PropTypes.string,
  locationTypes: PropTypes.arrayOf(PropTypes.shape({
    locations: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
  })),
  onBlur: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
  selectedCounty: PropTypes.string,
  selectedLocationType: PropTypes.string,
  usStates: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
  })),
}
export default IncidentInformationForm
