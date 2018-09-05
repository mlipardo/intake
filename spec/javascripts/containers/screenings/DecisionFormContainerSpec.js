import {mapDispatchToProps} from 'containers/screenings/DecisionFormContainer'

describe('DecisionFormContainer', () => {
  describe('mapDispatchToProps', () => {
    let dispatch
    let onShow
    let onSave
    let props
    beforeEach(() => {
      dispatch = jasmine.createSpy('dispatch')
      onShow = jasmine.createSpy('onShow')
      onSave = jasmine.createSpy('onSave')
      props = mapDispatchToProps(dispatch, {onShow, onSave})
    })
    describe('when saving', () => {
      it('sets the card to saving mode', () => {
        props.onSave()
        expect(onSave).toHaveBeenCalled()
      })
    })
    describe('when canceling', () => {
      it('sets the card to show mode', () => {
        const {onCancel} = props
        onCancel()
        expect(onShow).toHaveBeenCalled()
      })
    })
  })
})
