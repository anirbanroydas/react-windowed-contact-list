import React from 'react'
import PropTypes from 'prop-types'

import { LoadingSpinner } from './InfiniteScroll.js'

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
                    <div className="contact-card__title">Name: name</div>
                    <div className="contact-card__subtitile">Email: email</div>
                    <div className="contact-card__title">Agency: agency</div>
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
    }

    shouldComponentUpdate(prevProps) {
        const { isFetching, contacts } = this.props
        if ((prevProps.isFetching != isFetching) || (prevProps.contacts.itemIDs.length != contacts.itemIDs.length)) {
            return true
        }
        return false
    }

    render() {
        const { isFetching } = this.props
        const contactItems = this._getContactItems()
        
        return (
            <div className="contactlist">
                {contactItems}
                { (isFetching) ? <LoadingSpinner /> : null }
            </div>
        )
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
    contacts: PropTypes.array.isRequired
}


export { ContactList, ContactItem }
