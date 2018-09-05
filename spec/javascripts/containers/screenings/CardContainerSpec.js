import {
  EDIT_MODE,
  SHOW_MODE,
  SAVING_MODE,
  setCardMode,
} from 'actions/screeningPageActions'
import {mapDispatchToProps} from 'containers/screenings/CardContainer'

describe('CardContainer', () => {
  let dispatch
  beforeEach(() => {
    dispatch = jasmine.createSpy('dispatch')
  })
  describe('onEdit', () => {
    it('sets card mode to edit', () => {
      const {onEdit} = mapDispatchToProps(dispatch, {id: 'fluffy'})

      onEdit()
      expect(dispatch).toHaveBeenCalledWith(setCardMode('fluffy', EDIT_MODE))
    })
  })

  describe('onSave', () => {
    it('sets the card mode to saving', () => {
      const {onSave} = mapDispatchToProps(dispatch, {id: 'spot'})

      onSave()
      expect(dispatch).toHaveBeenCalledWith(setCardMode('spot', SAVING_MODE))
    })
  })

  describe('onShow', () => {
    it('sets the card mode to show', () => {
      const {onShow} = mapDispatchToProps(dispatch, {id: 'fluffer'})

      onShow()
      expect(dispatch).toHaveBeenCalledWith(setCardMode('fluffer', SHOW_MODE))
    })
  })
})
