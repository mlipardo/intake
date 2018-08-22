import React from 'react'
import {ModalComponent} from 'react-wood-duck'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import SelectField from 'common/SelectField'
import PropTypes from 'prop-types'
import {RELATIONSHIP_TYPES} from 'enums/RelationshipTypes'
import {GENDERS_LEGACY} from 'enums/Genders'
import GENDERS from 'enums/Genders'

const textWrap = {whiteSpace: 'normal'}
export default class ScreeningCreateRelationship extends React.Component {
  constructor(props) {
    super(props)
    this.state = {show: false}
    this.handleShowModal = this.handleShowModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.displayFormatter = this.displayFormatter.bind(this)
    this.modalTable = this.modalTable.bind(this)
  }

  handleShowModal() {
    this.setState({
      show: !this.state.show,
    })
  }

  closeModal() {
    this.setState({
      show: false,
    })
  }

  displayFormatter({name, age, gender}) {
    return (
      <div>
        <ul className='unstyled-list'>
          <li>{name}</li>
          <li>{age}</li>
          <li>{GENDERS_LEGACY[gender] || GENDERS[gender] || ''}</li>
        </ul>
      </div>
    )
  }

  modalTable(candidates) {
    return (
      <BootstrapTable className='displayTable' bordered={false} data={candidates}>
        <TableHeaderColumn className = 'FocusPersonDetails' dataField='person' dataFormat={this.displayFormatter} tdStyle= {textWrap}>
          Focus Person
        </TableHeaderColumn>
        <TableHeaderColumn dataField='relationship' dataFormat={this.selectFieldFormat}>
          Relationship<br/>
          <div className='text-helper'>Focus Person / Related Person</div>
        </TableHeaderColumn>
        <TableHeaderColumn className = 'relatedPersonDetails' dataField='candidate' dataFormat={this.displayFormatter} isKey={true} tdStyle= {textWrap}>
          Related Person
        </TableHeaderColumn>
      </BootstrapTable>
    )
  }

  modalTitle() {
    return (<b>
      Create Relationship Type
    </b>)
  }

  selectFieldFormat() {
    return (
      <SelectField
        id='change_relationship_type'
        label=''
        onChange={() => {}}
      >
        <option key=''/>
        {RELATIONSHIP_TYPES.map((relationship) =>
          <option key={relationship.value} value={relationship.value}>{relationship.label}</option>)
        }
      </SelectField>
    )
  }

  modalFooter() {
    return (
      <div>
        <button aria-label='Cancel' className='btn btn-default' onClick={this.closeModal}> Cancel </button>
        <button aria-label='Create Relationship' className='btn btn-primary'>Create Relationship </button>
      </div>
    )
  }

  render() {
    return (
      <div className='row'>
        <div className='col-md-12' >
          <div className='pull-right'>
            <button
              aria-label='Create Relationship'
              className='btn btn-primary'
              onClick={this.handleShowModal}
            >
              Create Relationship
            </button>
          </div>
        </div>
        <div className='col-md-12' >
          <ModalComponent
            closeModal={this.closeModal}
            showModal={this.state.show}
            modalBody={this.modalTable(this.props.candidates)}
            modalFooter={this.modalFooter()}
            modalSize='large'
            modalTitle={'Create Relationship'}
          />
        </div>
      </div>
    )
  }
}

ScreeningCreateRelationship.propTypes = {
  candidates: PropTypes.arrayOf(PropTypes.shape({
    candidate: PropTypes.shape({
      age: PropTypes.string,
      candidate_id: PropTypes.string,
      dateOfBirth: PropTypes.string,
      gender: PropTypes.string,
      name: PropTypes.string,
    }),
    person: PropTypes.shape({
      age: PropTypes.string,
      legacy_id: PropTypes.string,
      dateOfBirth: PropTypes.string,
      gender: PropTypes.string,
      name: PropTypes.string,
    }),
  })),
  data: PropTypes.array,
}
