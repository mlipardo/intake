import {
  batchCreateRelationships,
  setFieldCandidate,
  resetFieldCandidate,
} from 'actions/relationshipsActions'
import {mapDispatchToProps} from 'containers/screenings/ScreeningCreateRelationshipContainer'

describe('ScreeningCreateRelationshipContainer', () => {
  describe('mapDispatchToProps', () => {
    let dispatch
    let props
    beforeEach(() => {
      dispatch = jasmine.createSpy('dispatch')
      props = mapDispatchToProps(dispatch)
    })
    describe('when changing', () => {
      it('calls setFieldCandidate with person id, candidate id, fieldSet, and value', () => {
        const {onChange} = props
        onChange('1', '805', 'relationshipType', '190')
        expect(dispatch).toHaveBeenCalled()
        expect(dispatch).toHaveBeenCalledWith(setFieldCandidate('1', '805', 'relationshipType', '190'))
      })
    })
    describe('when canceling', () => {
      it('calls resetFieldCandidate with person id', () => {
        const {onCancel} = props
        onCancel('805')
        expect(dispatch).toHaveBeenCalled()
        expect(dispatch).toHaveBeenCalledWith(resetFieldCandidate('805'))
      })
    })
    describe('when saving', () => {
      it('calls saving with person id', () => {
        const {onSave} = props
        onSave('805')
        expect(dispatch).toHaveBeenCalled()
        expect(dispatch).toHaveBeenCalledWith(batchCreateRelationships('805'))
      })
    })
  })
})
