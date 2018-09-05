import PersonSuggestion from 'common/PersonSuggestion'
import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Autocomplete from 'react-autocomplete'
import SuggestionHeader from 'common/SuggestionHeader'
import CreateUnknownPerson from 'screenings/CreateUnknownPerson'
import ShowMoreResults from 'common/ShowMoreResults'
import {logEvent} from 'utils/analytics'
import moment from 'moment'
import SearchByAddress from 'common/SearchByAddress'

const MIN_SEARCHABLE_CHARS = 2

const addPosAndSetAttr = (results) => {
  const one = 1
  for (let len = results.length, i = 0; i < len; ++i) {
    results[i].posInSet = i + one
    results[i].setSize = len
  }
}

const itemClassName = (isHighlighted) =>
  `search-item${isHighlighted ? ' highlighted-search-item' : ''}`

export default class Autocompleter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuVisible: false,
    }
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onItemSelect = this.onItemSelect.bind(this)
    this.renderMenu = this.renderMenu.bind(this)
    this.onChangeInput = this.onChangeInput.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit() {
    const {onSearch, searchTerm} = this.props
    onSearch(searchTerm)
    this.showMenu()
    this.inputRef.focus()
  }

  isSearchable(value) {
    return value && value.replace(/^\s+/, '').length >= MIN_SEARCHABLE_CHARS
  }

  hideMenu() {
    if (this.inputRef) {
      this.inputRef.setAttribute('aria-activedescendant', '')
    }
    this.setState({menuVisible: false})
  }

  showMenu() {
    this.setState({menuVisible: true})
  }

  onButtonSelect(item) {
    const {onClear, onChange, onSelect, onLoadMoreResults} = this.props
    if (item.createNewPerson) {
      onClear()
      onChange('')
      onSelect({id: null})
      this.setState({menuVisible: false})
    } else if (item.suggestionHeader) {
      return
    } else {
      onLoadMoreResults()
    }
  }

  onItemSelect(_value, item) {
    const {isSelectable, onClear, onChange, onSelect, staffId, startTime} = this.props
    if (item.legacyDescriptor) {
      if (isSelectable(item)) {
        logEvent('searchResultClick', {
          searchIndex: this.props.results.indexOf(item),
          staffId,
          startTime: moment(startTime).valueOf(),
        })
        onClear()
        onChange('')
        onSelect(item)
        this.hideMenu()
        return
      }
      alert('You are not authorized to add this person.') // eslint-disable-line no-alert
      return
    }
    this.onButtonSelect(item)
  }

  onFocus() {
    if (this.isSearchable(this.props.searchTerm)) {
      this.showMenu()
    } else {
      this.hideMenu()
    }
  }

  onBlur() {
    this.hideMenu()
  }

  renderMenu(items, _searchTerm, _style) {
    if (this.props.isAddressIncluded) {
      return <div className='autocomplete-menu menu-with-address'>{items}</div>
    }
    return <div className='autocomplete-menu menu-without-address'>{items}</div>
  }

  renderEachItem(item, id, isHighlighted) {
    const {total, results, searchTerm} = this.props
    const resultsLength = results.length
    const key = `${item.posInSet}-of-${item.setSize}`
    if (item.suggestionHeader) {
      return (
        <div id={id} key={key} aria-live='polite'>
          <SuggestionHeader
            currentNumberOfResults={resultsLength}
            total={total}
            searchTerm={searchTerm}
          />
        </div>
      )
    }
    return (
      <div id={id} key={key} className={itemClassName(isHighlighted)}>
        <PersonSuggestion {...item} />
      </div>)
  }

  renderItem(item, isHighlighted, _styles) {
    const className = itemClassName(isHighlighted)
    const key = `${item.posInSet}-of-${item.setSize}`
    const id = `search-result-${key}`
    if (isHighlighted && this.inputRef) {
      this.inputRef.setAttribute('aria-activedescendant', id)
    }
    if (item.showMoreResults) {
      return (<div id={id} key={key} className={className}>
        {<ShowMoreResults />}
      </div>)
    }
    if (item.createNewPerson) {
      return (<div id={id} key={key} className={className}>
        {<CreateUnknownPerson />}
      </div>)
    }
    return this.renderEachItem(item, id, isHighlighted)
  }

  onChangeInput(_, value) {
    const {onSearch, onChange, isAddressIncluded} = this.props
    if (this.isSearchable(value) && !isAddressIncluded) {
      onSearch(value)
      this.showMenu()
    } else {
      this.hideMenu()
    }
    onChange(value)
  }

  renderInput(props) {
    const newProps = {
      ...props,
      ref: (el) => {
        this.inputRef = el
        props.ref(el)
      },
    }
    return <input {...newProps}/>
  }

  render() {
    const {searchTerm, id, results, canCreateNewPerson, total, isAddressIncluded, onToggleAddressSearch} = this.props
    const showMoreResults = {showMoreResults: 'Show More Results', posInSet: 'show-more', setSize: 'the-same'}
    const createNewPerson = {createNewPerson: 'Create New Person', posInSet: 'create-new', setSize: 'the-same'}
    const suggestionHeader = [{suggestionHeader: 'suggestion Header'}]
    const canLoadMoreResults = results && total > results.length
    //Sequentually numbering items
    addPosAndSetAttr(results)
    const newResults = suggestionHeader.concat(results.concat(canLoadMoreResults ? showMoreResults : [], canCreateNewPerson ? createNewPerson : []))
    return (<div>
      <Autocomplete
        ref={(el) => (this.element_ref = el)}
        getItemValue={(_) => searchTerm}
        inputProps={{id, onBlur: this.onBlur, onFocus: this.onFocus}}
        items={newResults}
        onChange={this.onChangeInput}
        onSelect={this.onItemSelect}
        renderItem={this.renderItem}
        open={this.state.menuVisible}
        renderMenu={this.renderMenu}
        value={searchTerm}
        wrapperStyle={{display: 'block', position: 'relative'}}
        renderInput={(props) => this.renderInput(props)}
      />
      <SearchByAddress isAddressIncluded={isAddressIncluded} toggleAddressSearch={onToggleAddressSearch} onSubmit={this.handleSubmit} />
    </div>)
  }
}

Autocompleter.propTypes = {
  canCreateNewPerson: PropTypes.bool,
  id: PropTypes.string,
  isAddressIncluded: PropTypes.bool,
  isSelectable: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onLoadMoreResults: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onToggleAddressSearch: PropTypes.func,
  results: PropTypes.array,
  searchTerm: PropTypes.string,
  staffId: PropTypes.string,
  startTime: PropTypes.string,
  total: PropTypes.number,
}

Autocompleter.defaultProps = {
  isSelectable: () => true,
}

Autocompleter.displayName = 'Autocompleter'
