import {generateBabyDoe} from 'actions/safelySurrenderedBabyActions'
import {saveCard} from 'actions/screeningActions'
import {touchAllFields} from 'actions/screeningInformationFormActions'
import {
  cardName,
  mapDispatchToProps,
  mergeProps,
} from 'containers/screenings/ScreeningInformationFormContainer'

describe('ScreeningInformationFormContainer', () => {
  describe('mapDispatchToProps', () => {
    describe('when canceling', () => {
      it('sets card to show mode', () => {
        const dispatch = jasmine.createSpy('dispatch')
        const onShow = jasmine.createSpy('onShow')
        const {onCancel} = mapDispatchToProps(dispatch, {onShow})

        onCancel()

        expect(onShow).toHaveBeenCalled()
      })
    })
  })
  describe('mergeProps', () => {
    it('combines all props from stateProps, dispatchProps, and ownProps', () => {
      const stateProps = {
        state: 'abc',
      }

      const dispatchProps = {
        action: 'def',
      }

      const ownProps = {
        prop: 'ghi',
      }

      expect(mergeProps(stateProps, dispatchProps, ownProps)).toEqual(jasmine.objectContaining({
        state: 'abc',
        action: 'def',
        prop: 'ghi',
      }))
    })

    describe('when saving', () => {
      it('saves the card, touches the fields, and sets card to show mode', () => {
        const dispatch = jasmine.createSpy('dispatch')
        const onSave = jasmine.createSpy('onSave')
        const onShow = jasmine.createSpy('onShow')
        const props = mergeProps({screeningId: '3'}, {dispatch}, {onSave, onShow})

        props.onSave()

        expect(dispatch).toHaveBeenCalledWith(saveCard(cardName))
        expect(dispatch).not.toHaveBeenCalledWith(generateBabyDoe('3'))

        expect(dispatch).toHaveBeenCalledWith(touchAllFields())
        expect(onSave).toHaveBeenCalled()
        expect(onShow).not.toHaveBeenCalled()
      })

      it('triggers SSB when report type changes to SSB', () => {
        const dispatch = jasmine.createSpy('dispatch')
        const onSave = jasmine.createSpy('onSave')
        const onShow = jasmine.createSpy('onShow')
        const props = mergeProps({persistedReportType: '', screeningId: '3', reportType: 'ssb'}, {dispatch}, {onSave, onShow})

        props.onSave()

        expect(dispatch).not.toHaveBeenCalledWith(saveCard(cardName))
        expect(dispatch).toHaveBeenCalledWith(generateBabyDoe('3'))

        expect(dispatch).toHaveBeenCalledWith(touchAllFields())
        expect(onSave).toHaveBeenCalled()
        expect(onShow).not.toHaveBeenCalled()
      })

      it('does not trigger SSB when report type was already SSB', () => {
        const dispatch = jasmine.createSpy('dispatch')
        const onSave = jasmine.createSpy('onSave')
        const onShow = jasmine.createSpy('onShow')
        const props = mergeProps({persistedReportType: 'ssb', screeningId: '3', reportType: 'ssb'}, {dispatch}, {onSave, onShow})

        props.onSave()

        expect(dispatch).toHaveBeenCalledWith(saveCard(cardName))
        expect(dispatch).not.toHaveBeenCalledWith(generateBabyDoe('3'))

        expect(dispatch).toHaveBeenCalledWith(touchAllFields())
        expect(onSave).toHaveBeenCalled()
        expect(onShow).not.toHaveBeenCalled()
      })
    })
  })
})
