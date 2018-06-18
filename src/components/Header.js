import React from 'react'

import '../styles/Header.css'


class Header extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <header className="header">
                <div className="header-top-row">
                    <div className="header-top-left header-content">
                        Contacts App
                    </div>
                    <div className="header-top-right header-content">
                        <a target="_blank" href="https://github.com/anirbanroydas/react-windowed-contact-list">Github</a>
                    </div>
                </div>
                <div className="header-bottom-row">
                    { this.props.render() }
                </div>
            </header>
        )
    }
}


export default Header