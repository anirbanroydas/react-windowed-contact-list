import React from 'react'
import SearchApi, { INDEX_MODES } from 'js-worker-search'
import 'react-virtualized/styles.css'

import Header from './Header.js'
import SearchBar from './SearchBar.js'
import ContactList from './ContactList.js'

import '../styles/App.css'
import { ENGINE_METHOD_CIPHERS } from 'constants';


const JsonFile = 'dummyJsonAPIData.json'

const SearchAPI = new SearchApi({
    indexMode: INDEX_MODES.PREFIXES,
    tokenizePattern: /[ ,]+/,
    caseSensitive: false
})


class App extends React.Component {
    constructor(props) {
        super(props)

        // instance variables, not adding it to state, because this does not change after initiazlization
        // to load the entire json data set on initialization
        this.dummyJsonData = []
        // specifies how many data from dummyJsonData will be added to contacts and search index every time new data is loaded
        this.limit = 50
        // specifies how many extra items will be added when there is a windowed list view implementation, not applicable here
        this._listOverscanRowCount = 20
        this._threshold = 25
        this.contactListScrollingElem = React.createRef()
        this.isScrollingCustomElement = true

        this.state = {
            contacts: {items: {}, itemIDs: []},
            searchResults: {items: {}, itemIDs: []},
            isFetching: false,
            isSearchResultFetching: false,
            searchText: ''
        }
        
        this._loadMoreContacts = this._loadMoreContacts.bind(this)
        this.fetchJsonData = this.fetchJsonData.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.getNextJsonData = this.getNextJsonData.bind(this)
        this._renderSearchBar = this._renderSearchBar.bind(this)
    }

    componentDidMount() {
        this.setState({isFetching: true}, this.fetchJsonData)
    }

    async fetchJsonData() {
        const response = await fetch(JsonFile)
        const jsonData = await response.json()
        
        this.handleJsonData(jsonData)
    }

    handleJsonData(json) {
        this.dummyJsonData = json
        this.getNextJsonData(0, this.limit)
    }

    getNextJsonData(offset, limit) {
        const newContacts = this.processJsonData(offset, limit)
        
        // add contacts to client-side search index
        this.addToSearchIndex(newContacts)
        
        // now update the list
        this.setState((prevState) => ({
            contacts: {
                items: Object.assign({}, prevState.contacts.items, newContacts.items),
                itemIDs: [...prevState.contacts.itemIDs, ...newContacts.itemIDs]
            },
            isFetching: false
        }))
    }

    processJsonData(offset, limit) {
        // take a range of contacts from the dummyjOnsData from offset to offset+limit
        let data = this.dummyJsonData.slice(offset, Math.min(this.dummyJsonData.length, offset + limit))
        
        let key, contactID, contact, firstName, lastName, email, agency
        let items = {}
        let itemIDs = []
        
        for (let i = 0; i < limit; i++) {
            key = offset + i
            contactID = key.toString() + "_cid"
            contact = data[i]
            
            firstName = contact.firstname
            lastName = contact.lastname
            email = contact.email
            agency = contact.agency_name
            
            if (!firstName || firstName === 'NULL') firstName = ''
            if (!lastName || lastName === 'NULL') lastName = ''
            if (!email || email === 'NULL') email = ''
            if (!agency || agency === 'NULL') agency = ''

            items[contactID] = {contactID: contactID, name: firstName + lastName, email: email, agency: agency}
            itemIDs.push(contactID)
        }

        return {
            items,
            itemIDs
        }
    }

    async addToSearchIndex(contacts) {
        let contact, indexOfAt
        const items = contacts.items
        
        for (let contactID of contacts.itemIDs) {
            contact = items[contactID]
            // add name, email and agency to index only if they are not empty
            try {
                if (contact.name) SearchAPI.indexDocument(contactID, contact.name)
                if (contact.email) {
                    SearchAPI.indexDocument(contactID, contact.email)
                    indexOfAt = contact.email.lastIndexOf('@')
                    if (indexOfAt != -1) SearchAPI.indexDocument(contactID, contact.email.slice(indexOfAt+1))
                }
                if (contact.agency) SearchAPI.indexDocument(contactID, contact.agency)
            } catch(error) {
                console.log(error)
            }
        }
    }

    async handleSearch(value) {
        console.log("handleSearch: value: ", value)
        // only change searchText if its not equivalent to previos searchText
        if (this.state.searchText != value) {
            this.setState({
                searchText: value,
                isSearchResultFetching: (value !== '')
            })
        }

        // if searchText is empty, don't do anything, just return to avoid re rendering
        if (value === '') {
            return
        }

        // get the itemIDs mathing the search text
        let searchResultIDs = []
        try {
            searchResultIDs = await SearchAPI.search(value)
        } catch(error) {
            console.log(error)
            return
        }
        this.setSearchResults(searchResultIDs)
    }

    _loadMoreContacts() {
        // if reached end of windoe when list if based on search result, don't load general data
        if (this.state.isSearchResultFetching) return

        // load next set of json data since its not out of search results
        this.setState({
            isFetching: true
        })
        setTimeout(() => this.getNextJsonData(this.state.contacts.itemIDs.length, this.limit), 100)
    }

    setSearchResults(contactIDs) {
        let searchResults = {}
        let searchResultItems = {}
        let searchResultItemIDs = []

        const items = this.state.contacts.items
        
        for (let contactID of contactIDs) {
            searchResultItems[contactID] = items[contactID]
            searchResultItemIDs.push(contactID)
        }

        searchResults = {
            items: searchResultItems,
            itemIDs: searchResultItemIDs
        }
        this.setState({
            searchResults: searchResults
        })
    }

    _renderSearchBar() {
        const { searchResults, searchText, isSearchResultFetching } = this.state
        console.log("_renderSearchBar: searchText: "+ searchText+ " isSearchResultFetching: "+ isSearchResultFetching)

        return (
            <div className="search-bar-container">
                <SearchBar 
                    onTextChange={this.handleSearch}
                    searchText={searchText}
                />
                <div className="search-bar-results">
                    { (isSearchResultFetching) && searchResults.itemIDs.length + " Results" }
                </div>
            </div>
        )
    }

    render() {
        const { contacts, isFetching, searchResults, searchText, isSearchResultFetching, isScrollingCustomElement, contactListScrollingElem } = this.state
        
        return (
            <div className="app-container">
                <div className="header-container">
                    <Header
                        searchText={searchText}
                        render={this._renderSearchBar}
                    />
                </div>
                <div 
                    className="body-container"
                    ref={this.contactListScrollingElem}
                >
                    <div className="contact-list-container">
                        {/* only rnder ContactWithInfiniteScroll when either of searchResults or contacts have atleast 1 item in it */}
                        { (((isSearchResultFetching) && (searchResults.itemIDs.length > 0)) || (contacts.itemIDs.length > 0)) &&
                            <ContactList 
                                contacts={(isSearchResultFetching) ? searchResults : contacts}
                                isFetching={isFetching}
                                isSearchResultFetching={isSearchResultFetching}
                                isScrollingCustomElement={this.isScrollingCustomElement}
                                customScrollingElement={this.contactListScrollingElem}
                                loadMoreContacts={this._loadMoreContacts}
                                threshold={this._threshold}
                                listOverscanRowCount={this._listOverscanRowCount}
                            />
                        }
                    </div>
                </div>
            </div>
        )
    }
}


export default App
