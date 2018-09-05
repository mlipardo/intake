import {mapDispatchToProps} from 'containers/screenings/WorkerSafetyFormContainer'

describe('WorkerSafetyFormContainer', () => {
  describe('mapDispatchToProps', () => {
    let dispatch
    let onSave
    let onShow
    let props
    beforeEach(() => {
      dispatch = jasmine.createSpy('dispatch')
      onSave = jasmine.createSpy('onSave')
      onShow = jasmine.createSpy('onShow')

      props = mapDispatchToProps(dispatch, {onSave, onShow})
    })
    describe('when saving', () => {
      it('sets the card to saving mode', () => {
        props.onSave()
        expect(onSave).toHaveBeenCalled()
      })
      it('navigates to the card', () => {
        props.onSave()
      })
    })
    describe('when canceling', () => {
      it('sets the card to show mode', () => {
        const {onCancel} = props
        onCancel()
        expect(onShow).toHaveBeenCalled()
      })
      it('navigates to the card', () => {
        const {onCancel} = props
        onCancel()
      })
    })
  })
})
