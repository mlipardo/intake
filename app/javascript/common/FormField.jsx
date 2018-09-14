import ClassNames from 'classnames'
import ErrorMessages from 'common/ErrorMessages'
import PropTypes from 'prop-types'
import React from 'react'

const FormField = ({children, errors, gridClassName, textWrapClassName, labelClassName, htmlFor, label, required}) => {
  const emptyArrayLength = 0
  const hasErrors = errors && errors.length > emptyArrayLength
  const gridClassNames = ClassNames(gridClassName, {'input-error': hasErrors})
  const textWrapClassNames = ClassNames(textWrapClassName)
  const labelClassNames =
    ClassNames(labelClassName, {'input-error-label': hasErrors}, {required: required})
  return (
    <div className={gridClassNames}>
      {label && <label htmlFor={htmlFor} className={labelClassNames}>
        {label}
      </label>}
      <div className={textWrapClassNames}>
        {children}
      </div>
      <ErrorMessages ariaDescribedBy={htmlFor} errors={errors}/>
    </div>
  )
}

FormField.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  errors: PropTypes.array,
  gridClassName: PropTypes.string,
  htmlFor: PropTypes.string,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  required: PropTypes.bool,
  textWrapClassName: PropTypes.string,
}
export default FormField
