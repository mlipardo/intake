import React from 'react'
import CreateRelationshipForm from 'common/relationship/CreateRelationshipForm'
import {ModalComponent} from 'react-wood-duck'
import PropTypes from 'prop-types'

export default class ScreeningCreateRelationship extends React.Component {
  constructor(props) {
    super(props)
    this.state = {show: false}
    this.closeModal = this.closeModal.bind(this)
    this.handleShowModal = this.handleShowModal.bind(this)
    this.saveCreateRelationship = this.saveCreateRelationship.bind(this)
  }

  closeModal() {
    this.setState({
      show: false,
    })
    this.props.onCancel(this.props.personId)
  }

  handleShowModal() {
    this.setState({
      show: !this.state.show,
    })
  }

  saveCreateRelationship() {
    this.handleShowModal()
    this.props.onSave(this.props.personId)
  }

  modalFooter() {
    return (
      <div>
        <button
          aria-label='Cancel'
          className='btn btn-default'
          onClick={this.closeModal}
        >
          Cancel
        </button>
        <button
          aria-label='Create Relationship'
          className='btn btn-primary'
          onClick={this.saveCreateRelationship}
        >
          Create Relationship
        </button>
      </div>
    )
  }

  render() {
    const {candidates, onChange} = this.props
    return (
      <div className='row'>
        <div className='col-md-12' >
          <div className='pull-right'>
            <button aria-label='Create Relationship' className='btn btn-primary' onClick={this.handleShowModal}>
              Create Relationship
            </button>
          </div>
        </div>
        <div className='col-md-12' >
          <ModalComponent
            closeModal={this.closeModal}
            showModal={this.state.show}
            modalBody={<CreateRelationshipForm candidates={candidates} onChange={onChange}/>}
            modalFooter={this.modalFooter()}
            modalSize='large'
            modalTitle={'Create Relationships'}
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
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    person: PropTypes.shape({
      age: PropTypes.string,
      dateOfBirth: PropTypes.string,
      gender: PropTypes.string,
      id: PropTypes.string,
      legacy_id: PropTypes.string,
      name: PropTypes.string,
    }),
  })),
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
  personId: PropTypes.string,
}
