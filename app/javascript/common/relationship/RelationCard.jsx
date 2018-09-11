import React from 'react'
import PropTypes from 'prop-types'
import ActionMenu from 'common/relationship/ActionMenu'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {sortDateOfBirth} from 'utils/sortDateOfBirth'

const propTypes = {
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
  isScreening: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  pendingPeople: PropTypes.arrayOf(PropTypes.string),
  person: PropTypes.shape({
    name: PropTypes.string,
    secondaryRelationship: PropTypes.string,
  }),
  screeningId: PropTypes.string,
}

const ageDisplayFormatter = (cell, row) => <div> {row.dateOfBirth || ''} {row.age === '' ? '' : `(${row.age})`}</div>

const textWrap = {whiteSpace: 'normal'}

const RelationCard = ({
  editFormRelationship,
  isScreening,
  onChange,
  onClick,
  onEdit,
  onSave,
  pendingPeople = [],
  person,
  screeningId,
}) => (
  <div>
    <div className='child-name'>
      <b>
        {person.name}
      </b>
    </div>
    <div>
      <BootstrapTable
        bordered={false}
        data={person.relationships}
        search={false}
        searchPlaceholder='Quick Filter'
        options={{expandBy: 'column'}}
      >
        <TableHeaderColumn
          tdStyle= {textWrap}
          dataField='name'
          dataSort={true}
          isKey={true}
          sortHeaderColumnClassName='sorted-header'
        >
            Name
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='secondaryRelationship'
          dataSort={true}
          sortHeaderColumnClassName='sorted-header'
        >
            Relationship
        </TableHeaderColumn>
        <TableHeaderColumn
          dataFormat={ageDisplayFormatter}
          dataField='age'
          dataSort={true}
          sortHeaderColumnClassName='sorted-header'
          sortFunc={sortDateOfBirth}
        >
            Age
        </TableHeaderColumn>
        <TableHeaderColumn
          dataFormat={(cell, row) =>
            <ActionMenu
              editFormRelationship={editFormRelationship}
              isScreening={isScreening}
              onChange={onChange}
              onClick={onClick}
              onEdit={onEdit}
              onSave={onSave}
              pendingPeople={pendingPeople}
              person={person}
              relationship ={row}
              screeningId={screeningId}
            />}
          width='15%'
        >
            Actions
        </TableHeaderColumn>
      </BootstrapTable>
    </div>
  </div>
)

RelationCard.propTypes = propTypes

export default RelationCard
