import React from 'react'
import {ModalComponent} from 'react-wood-duck'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import SelectField from 'common/SelectField'
import PropTypes from 'prop-types'
import {RELATIONSHIP_TYPES} from 'enums/RelationshipTypes'
import {GENDERS_LEGACY} from 'enums/Genders'
import GENDERS from 'enums/Genders'

const rel_data = [
  {
    "client_id": "ZXY123",
    "relative_id": "ABC987",
    "relationship_type": 190,
    "absent_parent_indicator": true,
    "same_home_status": "Y",
    "start_date": "1999-10-01",
    "end_date": "2010-10-01",
    "legacy_id": "A1b2x"
  },
  {
    "client_id": "ZXY124",
    "relative_id": "ABC987",
    "relationship_type": 191,
    "absent_parent_indicator": true,
    "same_home_status": "Y",
    "start_date": "1999-10-01",
    "end_date": "2010-10-01",
    "legacy_id": "A1b2x"
  }
]

const textWrap = {whiteSpace: 'normal'}
export default class ScreeningCreateRelationship extends React.Component {
  constructor(props) {
    super(props)
    this.state = {show: false, candidates: {}, relationships_to_create: {}}
    this.handleShowModal = this.handleShowModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.displayFormatter = this.displayFormatter.bind(this)
    this.modalTable = this.modalTable.bind(this)
    this.batchCreateRelationship = this.batchCreateRelationship.bind(this)
    this.setRelationshipCode = this.setRelationshipCode.bind(this)
    this.selectFieldFormat = this.selectFieldFormat.bind(this)
    this.createRelationshipDropDown = this.createRelationshipDropDown.bind(this)
  }

  componentDidMount(){
    this.update()
  }

  update() {
    const candidates = this.props.candidates
    if (this.state.candidates !== candidates) {
      this.setState({candidates: candidates})
    }
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
    const candidates =  rel_data
    console.log('batchCreateRelationship')
    console.log(candidates)
    console.log(this.state)
    this.props.batchCreateRelationships(candidates)
    
  }

  setRelationshipCode(event) {
    // this.setState({candidates: {...this.state.candidates, [field]: value}})
    // console.log(field)
    // console.log(value)
    console.log(event.target.id)
    console.log(event.target.value)
    console.log(event.target)
    console.log('inside onChange')
    console.log(this.state.candidates)
  }

  createRelationshipDropDown(name){
    console.log('createRelationshipDropDown')
    console.log(name)
    // this.selectFieldFormat()
  }

  selectFieldFormat(person) {
    // console.log(row.focus_person.name)
    return (
      <SelectField
        id={person.recordId}
        label=''
        onChange={(event)=>{
           this.setRelationshipCode(event)
        }
        }
      // value={this.state.relationship_code}
      >
        <option key=''/>
        {RELATIONSHIP_TYPES.map((relationship) =>
          <option key={relationship.value} value={relationship.value}>{relationship.label}</option>)
        }
      </SelectField>
    )
  }

  modalTitle() {
    return (<b>
      Create Relationship Type
    </b>)
  }

  modalTable(candidates) {
    return (
      <BootstrapTable className='displayTable' bordered={false} data={candidates}>
        <TableHeaderColumn className = 'FocusPersonDetails' dataField='person' dataFormat={this.displayFormatter} tdStyle= {textWrap}>
          Focus Person
        </TableHeaderColumn>
        <TableHeaderColumn dataField='person' dataFormat={this.selectFieldFormat}>
          Relationship<br/>
          <div className='text-helper'>Focus Person / Related Person</div>
        </TableHeaderColumn>
        <TableHeaderColumn className = 'relatedPersonDetails' dataField='candidate' dataFormat={this.displayFormatter} isKey={true} tdStyle= {textWrap}>
          Related Person
        </TableHeaderColumn>
      </BootstrapTable>
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
            modalBody={this.modalTable(this.state.candidates)}
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
  candidates: PropTypes.array,
  batchCreateRelationship: PropTypes.func,
}
