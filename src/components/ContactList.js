import React from 'react'
import PropTypes from 'prop-types'
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized';

import '../styles/Contacts.css'


const avatars = ['avatar_1.png', 'avatar_2.png']


class ContactItem extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        const { name, email, agency, index } = this.props
        const avatar = avatars[index%2]

        return (
            <div className="contact-card contact-card--full">
                <img className="contact-card__image" src={ avatar }  alt="" />
                <div className="contact-card__main">
                    <div className="contact-card__title">Name: {name}</div>
                    <div className="contact-card__subtitile">Email: {email}</div>
                    <div className="contact-card__title">Agency: {agency}</div>
                </div>
            </div>
        )
    }
}

ContactItem.propTypes = {
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    agency: PropTypes.string.isRequired
}


class ContactList extends React.Component {
    constructor(props) {
        super(props)

        this._autosizerDisableHeight = true
        this._listClassName = "contactList"
        // specifies the individual height of each contact item
        this._listRowHeight = 115
        this._listAutoHeight = true

        this._setWindowScrollerRef = this._setWindowScrollerRef.bind(this)
        this._getContactItemRow = this._getContactItemRow.bind(this)
        this._handleRowsRendered = this._handleRowsRendered.bind(this)
    }

    shouldComponentUpdate(prevProps) {
        const { isFetching, contacts } = this.props
        if ((prevProps.isFetching != isFetching) || (prevProps.contacts.itemIDs.length != contacts.itemIDs.length)) {
            return true
        }
        return false
    }

    render() {
        const { isFetching, customScrollingElement, isScrollingCustomElement, contacts, threshold, listOverscanRowCount } = this.props
        this._listRowCount = contacts.itemIDs.length
        
        return (
            <WindowScroller
                scrollElement={window}
            >
                {({height, width, isScrolling, registerChild, onChildScroll, scrollTop}) => (
                    <div ref={registerChild} className={this._listClassName}>
                        <List
                            autoHeight
                            height={height}
                            width={width}
                            isScrolling={isScrolling}
                            // onScroll={onChildScroll}
                            overscanRowCount={listOverscanRowCount}
                            rowCount={this._listRowCount}
                            rowHeight={this._listRowHeight}
                            // scrollToIndex={scrollToIndex}
                            scrollTop={scrollTop}
                            // noRowsRenderer={this._noRowsRenderer}
                            rowRenderer={this._getContactItemRow}
                            onRowsRendered={this._handleRowsRendered}
                        />
                    </div>
                )}
            </WindowScroller>
        )
    }

    _setWindowScrollerRef(windowScroller) {
        this._windowScroller = windowScroller;
    }

    _getContactItemRow({index, isScrolling, isVisible, key, style}) {
        const { contacts, isFetching } = this.props;
        
        const itemID = contacts.itemIDs[index]
        const contact = contacts.items[itemID]
        
        return (
            <div key={key} style={style}>
                <ContactItem
                    name={contact.name}
                    email={contact.email}
                    agency={contact.agency}
                    index={index}
                />
            </div>
        )
    }

    _handleRowsRendered({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) {
        const { contacts, isFetching, isSearchResultFetching, loadMoreContacts, threshold } = this.props

        if ((!isFetching) && (!isSearchResultFetching) && (overscanStopIndex > (contacts.itemIDs.length - threshold))) {
            loadMoreContacts()
        }
    }


    _getContactItems() {
        const { contacts } = this.props

        let contactItems = []
        let contact

        for (let i = 0; i < contacts.itemIDs.length; i++) {
            contact = this._renderContactItem(contacts.items[contacts.itemIDs[i]], i)
            contactItems.push(contact)
        }
        return contactItems
    }

    // return an individual ContactItem row for given index
    _renderContactItem(item, index) {
        return (
            <div className="g-col" key={item.contactID}>
                <ContactItem
                    name={item.name}
                    email={item.email}
                    agency={item.agency}
                    index={index}
                />
            </div>
        )
    }
}

ContactList.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    contacts: PropTypes.object.isRequired,
    isSearchResultFetching: PropTypes.bool.isRequired,
    loadMoreContacts: PropTypes.func.isRequired,
    threshold: PropTypes.number.isRequired,
    listOverscanRowCount: PropTypes.number.isRequired
}


export default ContactList
