import React from 'react'
import PropTypes from 'prop-types'
import CheckboxField from 'common/CheckboxField'
import DateField from 'common/DateField'
import {RELATIONSHIP_TYPES} from 'enums/RelationshipTypes'
import relationshipDropdown from 'common/relationship/relationship_dropdown/relationshipDropdown'

const isAbsentParentDisabled = (type) => (
  !type.toLowerCase().match(/\bfather\b|\bmother\b|\bparent\b/)
)
const findTypeLabel = (typeCode) => {
  const types = (RELATIONSHIP_TYPES.find((type) =>
    type.value === typeCode
  ).label).split('/')
  return {
    secondary: types.pop(),
    index: types.pop(),
  }
}

const EditRelationshipForm = ({editFormRelationship, onChange, person, relationship}) => {
  const relationshipTypeList = relationshipDropdown(
    person,
    relationship
  )
  const type = findTypeLabel(editFormRelationship.relationship_type)
  return (
    <div>
      <table className='table'>
        <thead>
          <tr>
            <th className='col-md-3'>Person 1</th>
            <th className='col-md-6'>
              Relationship
              <div className='text-helper'>
                Person 1/ Person 2
              </div>
            </th>
            <th className='col-md-3'>Person 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <ul className='unstyled-list'>
                <li>{person.name}</li>
                <li>{person.age}</li>
                <li>{person.gender}</li>
              </ul>
            </td>
            <td>
              <select
                id='edit_relationship'
                label='Relationship Type'
                value={editFormRelationship.relationship_type}
                aria-label='Relationship Type'
                onChange={({target}) => {
                  onChange('relationship_type', parseInt(target.value, 10))
                  if (!isAbsentParentDisabled(type.secondary)) {
                    onChange('absent_parent_indicator', false)
                  }
                }}
              >
                <option key=''/>
                {relationshipTypeList.map((relationship) =>
                  <option key={relationship.value} value={relationship.value}>
                    {relationship.label}
                  </option>
                )}
              </select>
            </td>
            <td>
              <ul className='unstyled-list'>
                <li>{relationship.name}</li>
                <li>{relationship.age}</li>
                <li>{relationship.gender}</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <div className='row gap-top pad-left'>
        <div className='col-md-12'>
          <span>
            <b>{person.name}</b> is the {type.index} of {type.secondary} <b>{relationship.name}</b>
          </span>
        </div>
      </div>
      <div className='row pad-left'>
        <div className='col-md-4'>
          <CheckboxField
            checked={editFormRelationship.same_home_status === 'Y'}
            id='same_home_status'
            label='Live at the Same Location'
            onChange={({target}) => {
              onChange('same_home_status', (target.value === 'Y') ? 'N' : 'Y')
            }}
            value={editFormRelationship.same_home_status}
          />
        </div>
        <div className='col-md-4'>
          <CheckboxField
            checked={editFormRelationship.absent_parent_indicator}
            disabled={isAbsentParentDisabled(type.secondary)}
            id='absent_parent_indicator'
            label='Parents Whereabouts Unknown'
            onChange={({target}) => onChange('absent_parent_indicator', (target.checked))}
            value={editFormRelationship.absent_parent_indicator.toString()}
          />
        </div>
      </div>
      <div className='row pad-left'>
        <DateField
          gridClassName='col-md-4'
          id='relationship_start_date'
          label='Start Date'
          value={editFormRelationship.start_date}
          onChange={(value) => onChange('start_date', value)}
          hasTime={false}
        />
        <DateField
          gridClassName='col-md-4'
          id='relationship_end_date'
          label='End Date'
          value={editFormRelationship.end_date}
          onChange={(value) => onChange('end_date', value)}
          hasTime={false}
        />
      </div>
    </div>
  )
}

const personPropType = PropTypes.shape({
  age: PropTypes.string,
  dateOfBirth: PropTypes.string,
  legacy_id: PropTypes.string,
  gender: PropTypes.string,
  name: PropTypes.string,
})
const relationshipPropType = PropTypes.shape({
  absent_parent_indicator: PropTypes.string,
  age: PropTypes.string,
  dateOfBirth: PropTypes.string,
  legacy_descriptor: PropTypes.object,
  gender: PropTypes.string,
  name: PropTypes.string,
  person_card_exists: PropTypes.bool,
  same_home_code: PropTypes.string,
  type: PropTypes.string,
  type_code: PropTypes.string,
})

EditRelationshipForm.propTypes = {
  editFormRelationship: PropTypes.shape({
    absent_parent_indicator: PropTypes.bool,
    client_id: PropTypes.string,
    end_date: PropTypes.string,
    id: PropTypes.string,
    relationship_type: PropTypes.number,
    relative_id: PropTypes.string,
    same_home_status: PropTypes.string,
    start_date: PropTypes.string,
  }),
  onChange: PropTypes.func,
  person: personPropType,
  relationship: relationshipPropType,
}

export default EditRelationshipForm
