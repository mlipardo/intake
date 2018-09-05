import FormField from 'common/FormField'
import PropTypes from 'prop-types'
import React from 'react'
import CardActionRow from 'screenings/CardActionRow'

const NarrativeForm = ({
  isSaving,
  onBlur,
  onCancel,
  onChange,
  onSave,
  reportNarrative,
}) => (
  <div className='card-body'>
    <div className='row'>
      <FormField
        errors={reportNarrative.errors}
        gridClassName='col-md-12'
        htmlFor='report_narrative'
        label='Report Narrative'
        required
      >
        <textarea
          id='report_narrative'
          onChange={({target: {value}}) => onChange('report_narrative', value)}
          onBlur={() => onBlur('report_narrative')}
          required
          value={reportNarrative.value}
        />
      </FormField>
    </div>
    <CardActionRow onCancel={onCancel} onSave={onSave} isSaving={isSaving}/>
  </div>
)

NarrativeForm.propTypes = {
  isSaving: PropTypes.bool,
  onBlur: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
  reportNarrative: PropTypes.shape({
    value: PropTypes.string,
    errors: PropTypes.array,
  }),
}

NarrativeForm.defaultProps = {
  reportNarrative: {},
}

export default NarrativeForm
