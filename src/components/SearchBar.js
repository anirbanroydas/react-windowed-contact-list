import React from 'react'
import PropTypes from 'prop-types'

import '../styles/SearchBar.css'


class SearchBar extends React.PureComponent {
    constructor(props) {
        super(props)

        this._handleInputChange = this._handleInputChange.bind(this)
    }

    render() {
        return (
            <div className="search-bar">
                <input
                    autoComplete="off"
                    className="search-bar_input"
                    maxLength="60"
                    placeholder="Search Contacts"
                    tabIndex="0"
                    type="text"
                    value={this.props.searchText}
                    onChange={this._handleInputChange}
                />
            </div>
        )
    }

    _handleInputChange(event) {
        event.preventDefault()
        this.props.onTextChange(event.target.value)
    }
}

SearchBar.propTypes = {
    onTextChange: PropTypes.func.isRequired,
    searchText: PropTypes.string.isRequired
}

export default SearchBar
