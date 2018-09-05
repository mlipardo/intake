import {connect} from 'react-redux'
import HistoryTable from 'views/history/HistoryTable'
import {
  getFormattedCasesSelector,
  getFormattedReferralsSelector,
  getFormattedScreeningsSelector,
} from 'selectors/screening/historyOfInvolvementSelectors'
import * as IntakeConfig from 'common/config'
import {copyTable} from 'utils/copyTable'

const mapStateToProps = (state) => ({
  showCopyButton: IntakeConfig.jsClipboardSupported(),
  cases: getFormattedCasesSelector(state).toJS(),
  referrals: getFormattedReferralsSelector(state).toJS(),
  screenings: getFormattedScreeningsSelector(state).toJS(),
  onCopy: (e, target, callback) => {
    const data = target.cloneNode(true)
    try {
      data.style.display = 'block'
      e.clipboardData.setData('text/html', data.outerHTML)
      e.preventDefault()
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()
    } catch (error) {
      if (callback) {
        callback()
      }
    }
  },
  friendlyCopy: (callback) => {
    const table = document.getElementById('history-copy-friendly')
    copyTable(table, callback)
  },
})

export default connect(mapStateToProps)(HistoryTable)
