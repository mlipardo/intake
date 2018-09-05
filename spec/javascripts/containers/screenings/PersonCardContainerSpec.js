import {SHOW_MODE, SAVING_MODE, setPersonCardMode} from 'actions/screeningPageActions'
import {mapDispatchToProps} from 'containers/screenings/PersonCardContainer'

describe('PersonCardContainer', () => {
  describe('mapDispatchToProps', () => {
    const id = '34592'
    let dispatch
    let props
    beforeEach(() => {
      dispatch = jasmine.createSpy('dispatch')
      props = mapDispatchToProps(dispatch, {personId: id})
    })

    describe('when saving', () => {
      it('sets the card to saving mode', () => {
        props.onSave()
        expect(dispatch).toHaveBeenCalledWith(setPersonCardMode(id, SAVING_MODE))
      })
    })
    describe('when canceling', () => {
      it('sets the card to show mode', () => {
        props.onCancel()
        expect(dispatch).toHaveBeenCalledWith(setPersonCardMode(id, SHOW_MODE))
      })
    })
  })
})
