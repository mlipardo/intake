import React from 'react'
import PropTypes from 'prop-types'
import ClassNames from 'classnames'
import EditLink from 'common/EditLink'
import {EDIT_MODE, SHOW_MODE, SAVING_MODE} from 'actions/screeningPageActions'
import {setHash} from 'utils/navigation'

const modeClass = (mode) => (mode === SHOW_MODE ? 'show' : 'edit')

class CardView extends React.PureComponent {
  componentDidUpdate(prevProps) {
    if (this.props.mode === SHOW_MODE && prevProps.mode !== SHOW_MODE) {
      setHash(`#${this.props.id}-anchor`)
    }
  }

  render() {
    const {edit, editable, id, mode, onEdit, onSave, onShow, show, title} = this.props
    return (
      <div>
        <a className='anchor' id={`${id}-anchor`}/>
        <div className={ClassNames('card', modeClass(mode), 'double-gap-bottom', 'position-relative')} id={id}>
          <div className='card-header'>
            <h2>{title}</h2>
            {(editable && mode === SHOW_MODE) &&
              <EditLink
                ariaLabel={`Edit ${title && title.toLowerCase()}`}
                onClick={(event) => {
                  event.preventDefault()
                  onEdit()
                }}
              />
            }
          </div>
          {(mode === EDIT_MODE || mode === undefined) && edit && React.cloneElement(edit, {onSave, onShow})}
          {(mode === SAVING_MODE) && edit && React.cloneElement(edit, {isSaving: true})}
          {mode === SHOW_MODE && show}
        </div>
      </div>
    )
  }
}

CardView.propTypes = {
  edit: PropTypes.element,
  editable: PropTypes.bool,
  id: PropTypes.string,
  mode: PropTypes.string,
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  onShow: PropTypes.func,
  show: PropTypes.element,
  title: PropTypes.string,
}

export default CardView
