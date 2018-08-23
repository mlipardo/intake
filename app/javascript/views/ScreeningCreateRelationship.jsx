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
    this.state = {show: false, candidates: {}, relationshipCandidates: {}}
    this.handleShowModal = this.handleShowModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.displayFormatter = this.displayFormatter.bind(this)
    this.modalTable = this.modalTable.bind(this)
    this.batchCreateRelationship = this.batchCreateRelationship.bind(this)
    this.setRelationshipType = this.setRelationshipType.bind(this)
    this.selectFieldFormat = this.selectFieldFormat.bind(this)
    this.getRelationshipType = this.getRelationshipType.bind(this)
  }

  componentDidMount(){
    this.update()
  }

  update() {
    console.log(JSON.stringify(this.props.candidates))
  }

  handleShowModal() {
    this.setState({
      show: !this.state.show,
    })
    const candidates = this.props.candidates
    if (this.state.candidates !== candidates) {
      this.setState({candidates: candidates})
    }
    let relationshipCandidates = []
    const sysDate = new Date().toJSON().slice(0,10)
    candidates.map((rec)=>{
      relationshipCandidates.push({
        client_id: rec.person.personId,
        relative_id: rec.candidate.candidateId,
        relationship_type: null,
        absent_parent_indicator: true,
        same_home_status: 'Y',
        start_date: sysDate ,
        end_date: null,
        legacy_id: rec.person.legacy_id,
        })
    })
    this.setState({relationshipCandidates: relationshipCandidates})

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
    const relationshipCandidates = this.state.relationshipCandidates
    this.props.batchCreateRelationships(relationshipCandidates)
    this.closeModal()
    
  }

  setRelationshipType(event) {
    const relationship_type = event.target.value
    const candidateId = event.target.id
    let relationshipCandidates = this.state.relationshipCandidates
    relationshipCandidates.map((rec)=>{
      if (rec.relative_id === candidateId) {
          rec.relationship_type = relationship_type
      }
    })
    this.setState({relationshipCandidates: relationshipCandidates})
  }

  getRelationshipType(candidateId){
    let relationship_type = null
    this.state.relationshipCandidates.map((rec)=>{
      if (rec.relative_id === candidateId) {
          relationship_type = rec.relationship_type
      }
    })
    return relationship_type
  }


  selectFieldFormat(candidate) {
   const candidateId = candidate.candidateId
   const relationshipType = this.getRelationshipType(candidateId)
    return (
      <SelectField
        id={candidateId}
        label=''
        onChange={(event)=>{
           this.setRelationshipType(event)
        }
        }
      value={relationshipType}
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
        <TableHeaderColumn dataField='candidate' dataFormat={this.selectFieldFormat}>
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
  candidates: PropTypes.array,
  batchCreateRelationship: PropTypes.func,
}
