import County from 'County'
import LocationType from 'LocationType'
import moment from 'moment'
import React from 'react'
import ResponseTime from 'ResponseTime'
import ScreeningDecision from 'ScreeningDecision'
import USState from 'USState'

const ReferralInformationEditView = ({screening, onChange}) => (
  <div className='card edit double-gap-top' id='referral-information-card'>
    <div className='card-header'>
      <span>Referral Information</span>
    </div>
    <div className='card-body'>
      <div className='row'>
        <div className='col-md-6'>
          <label htmlFor='screening_incident_date' className='no-gap'>Incident Date</label>
          <input
            type='date'
            name='screening[incident_date]'
            id='screening_incident_date'
            value={screening.get('incident_date') || ''}
            onChange={(event) => onChange(['incident_date'], event.target.value)}
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <label htmlFor='screening_incident_county'>Incident County</label>
          <select
            name='screening[incident_county]'
            id='screening_incident_county'
            value={screening.get('incident_county') || ''}
            onChange={(event) => onChange(['incident_county'], event.target.value)}
          >
            <option key='' value=''></option>
            {Object.keys(County).map((item) => <option key={item} value={item}>{County[item]}</option>)}
          </select>
        </div>
      </div>
      <fieldset className='double-gap-top'>
        <legend>Incident Address</legend>
        <input
          type='hidden'
          name='screening[address][id]'
          id='screening_address_id'
          value={screening.getIn(['address', 'id']) || ''}
        />
        <div className='row'>
          <div className='col-md-6'>
            <label htmlFor='screening_address_street_address' className='no-gap'>Address</label>
            <input
              type='text'
              name='screening[address][street_address]'
              id='screening_address_street_address'
              value={screening.getIn(['address', 'street_address']) || ''}
              onChange={(event) => onChange(['address', 'street_address'], event.target.value)}
            />
          </div>
          <div className='col-md-6'>
            <label htmlFor='screening_address_city' className='no-gap'>City</label>
            <input
              type='text'
              name='screening[address][city]'
              id='screening_address_city'
              value={screening.getIn(['address', 'city']) || ''}
              onChange={(event) => onChange(['address', 'city'], event.target.value)}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <label htmlFor='screening_address_state'>State</label>
            <select
              name='screening[address][state]'
              id='screening_address_state'
              value={screening.getIn(['address', 'state']) || ''}
              onChange={(event) => onChange(['address', 'state'], event.target.value)}
            >
              <option key='' value=''></option>
              {Object.keys(USState).map((item) => <option key={item} value={item}>{USState[item]}</option>)}
            </select>
          </div>
          <div className='col-md-6'>
            <label htmlFor='screening_address_zip'>Zip</label>
            <input
              type='text'
              name='screening[address][zip]'
              id='screening_address_zip'
              value={screening.getIn(['address', 'zip']) || ''}
              onChange={(event) => onChange(['address', 'zip'], event.target.value)}
            />
          </div>
        </div>
      </fieldset>
      <div className='row double-gap-top'>
        <div className='col-md-6'>
          <label htmlFor='screening_location_type'>Location Type</label>
          <select
            name='screening[location_type]'
            id='screening_location_type'
            value={screening.get('location_type')  || ''}
            onChange={(event) => onChange(['location_type'], event.target.value)}
          >
            <option key='' value=''></option>
            {Object.keys(LocationType).map((group) => {
              return (
                <optgroup key={group} label={group}>
                  {LocationType[group].map((item) => <option key={item} value={item}>{item}</option>)}
                </optgroup>
                )
            })}
          </select>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <label htmlFor='screening_response_time'>Response Time</label>
          <select
            name='screening[response_time]'
            id='screening_response_time'
            value={screening.get('response_time') || ''}
            onChange={(event) => onChange(['response_time'], event.target.value)}
          >
            <option key='' value=''></option>
            {Object.keys(ResponseTime).map((item) => <option key={item} value={item}>{ResponseTime[item]}</option>)}
        </select>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <label htmlFor='screening_screening_decision'>Screening Decision</label>
          <select
            name='screening[screening_decision]'
            id='screening_screening_decision'
            value={screening.get('screening_decision') || ''}
            onChange={(event) => onChange(['screening_decision'], event.target.value)}
          >
            <option key='' value=''></option>
            {Object.keys(ScreeningDecision).map((item) => <option key={item} value={item}>{ScreeningDecision[item]}</option>)}
          </select>
        </div>
      </div>
    </div>
  </div>
)

ReferralInformationEditView.propTypes = {
  screening: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func.isRequired,
}
export default ReferralInformationEditView
