import {EDIT_MODE, SAVING_MODE, SHOW_MODE} from 'actions/screeningPageActions'
import PersonCardHeader from 'views/people/PersonCardHeader'
import PropTypes from 'prop-types'
import React from 'react'
import CardActionRow from 'screenings/CardActionRow'
import {setHash} from 'utils/navigation'

class PersonCard extends React.PureComponent {
  componentDidUpdate(prevProps) {
    if (this.props.mode === SHOW_MODE && prevProps.mode !== SHOW_MODE) {
      setHash(`#participants-card-${this.props.personId}`)
    }
  }

  renderHeader() {
    const {
      deletable,
      editable,
      informationFlag,
      informationPill,
      mode,
      onDelete,
      onEdit,
      personName,
    } = this.props
    return (
      <PersonCardHeader
        informationFlag={informationFlag}
        onDelete={onDelete}
        showDelete={deletable}
        onEdit={onEdit}
        showEdit={editable && mode === SHOW_MODE}
        title={personName}
        informationPill={informationPill}
      />
    )
  }

  renderBody() {
    const {
      edit,
      mode,
      onCancel,
      onSave,
      show,
    } = this.props
    return (
      <div className='card-body'>
        {mode === SHOW_MODE && show}
        {mode !== SHOW_MODE && edit}
        {mode !== SHOW_MODE && <CardActionRow onCancel={onCancel} onSave={onSave} isSaving={mode === SAVING_MODE}/>}
      </div>
    )
  }

  render() {
    const {mode, personId} = this.props
    const modeClass = (mode === SHOW_MODE ? 'show' : 'edit')
    const className = `card ${modeClass} participant double-gap-bottom`
    const id = `participants-card-${personId}`

    return (
      <div className={className} id={id}>
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    )
  }
}

PersonCard.propTypes = {
  deletable: PropTypes.bool,
  edit: PropTypes.object,
  editable: PropTypes.bool.isRequired,
  informationFlag: PropTypes.string,
  informationPill: PropTypes.string,
  mode: PropTypes.oneOf([EDIT_MODE, SAVING_MODE, SHOW_MODE]).isRequired,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  personId: PropTypes.string.isRequired,
  personName: PropTypes.string.isRequired,
  show: PropTypes.object,
}

export default PersonCard
