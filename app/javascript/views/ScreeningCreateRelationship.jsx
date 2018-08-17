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
    this.batchCreateRelationship = this.batchCreateRelationship.bind(this)
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

  batchCreateRelationship () {
    const relationships =  this.props.data
    console.log('batchCreateRelationship')
    console.log(relationships)
    this.props.batchCreateRelationships(relationships)
    
  }

  modalTable(data) {
    return (
      <BootstrapTable className='displayTable' bordered={false} data={data}>
        <TableHeaderColumn className = 'FocusPersonDetails' dataField='focus_person' dataFormat={this.displayFormatter} tdStyle= {textWrap}>
          Focus Person
        </TableHeaderColumn>
        <TableHeaderColumn dataField='relationship' dataFormat={this.selectFieldFormat}>
          Relationship<br/>
          <div className='text-helper'>Focus Person / Related Person</div>
        </TableHeaderColumn>
        <TableHeaderColumn className = 'relatedPersonDetails' dataField='related_person' dataFormat={this.displayFormatter} isKey={true} tdStyle= {textWrap}>
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
        <button aria-label='Create Relationship' className='btn btn-primary' onClick={this.batchCreateRelationship} >Create Relationship </button>
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
            modalBody={this.modalTable(this.props.data)}
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
  data: PropTypes.array,
  batchCreateRelationship: PropTypes.func,
}
