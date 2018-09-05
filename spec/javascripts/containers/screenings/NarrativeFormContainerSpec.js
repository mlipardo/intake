import {mapDispatchToProps} from 'containers/screenings/NarrativeFormContainer'

describe('NarrativeFormContainer', () => {
  describe('mapDispatchToProps', () => {
    let dispatch
    let onShow
    let onSave
    let props

    beforeEach(() => {
      dispatch = jasmine.createSpy('dispatch')
      onShow = jasmine.createSpy('onShow')
      onSave = jasmine.createSpy('onSaving')
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
        props.onCancel()
        expect(onShow).toHaveBeenCalled()
      })
    })
  })
})
