import PersonCardHeader from 'views/people/PersonCardHeader'
import PropTypes from 'prop-types'
import React from 'react'
import CardActionRow from 'screenings/CardActionRow'

const PersonCard = ({
  deletable,
  edit,
  editable,
  informationFlag,
  informationPill,
  mode,
  onCancel,
  onDelete,
  onEdit,
  onSave,
  personId,
  personName,
  show,
}) => (
  <div className={`card ${mode} participant double-gap-bottom`} id={`participants-card-${personId}`}>
    <PersonCardHeader
      informationFlag={informationFlag}
      onDelete={onDelete}
      showDelete={deletable}
      onEdit={onEdit}
      showEdit={editable && mode === 'show'}
      title={personName}
      informationPill={informationPill}
    />
    <div className='card-body'>
      {mode === 'show' && show}
      {mode === 'edit' && edit}
      {mode === 'edit' && <CardActionRow onCancel={onCancel} onSave={onSave} />}
    </div>
  </div>
)

PersonCard.propTypes = {
  deletable: PropTypes.bool,
  edit: PropTypes.object,
  editable: PropTypes.bool.isRequired,
  informationFlag: PropTypes.string,
  informationPill: PropTypes.string,
  mode: PropTypes.oneOf(['edit', 'show']).isRequired,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  personId: PropTypes.string.isRequired,
  personName: PropTypes.string.isRequired,
  show: PropTypes.object,
}

export default PersonCard
