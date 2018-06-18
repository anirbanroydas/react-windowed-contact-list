import React from 'react'

import '../styles/InfiniteScroll.css'


const LoadingSpinner = (props) => {
    return (
        <div className="loading-indicator">
            <div className="circle circle--1" />
            <div className="circle circle--2" />
            <div className="circle circle--3" />
        </div>
    )
}


const withInfiniteScroll = (Component) => {
	return class InfiniteScroll extends React.Component {
        constructor(props) {
            super(props)

            this._handleScroll = this._handleScroll.bind(this)
        }

		componentDidMount() {
            window.addEventListener('scroll', this._handleScroll, false)
		}

		componentWillUnmount() {
            window.removeEventListener('scroll', this._handleScroll, false)
		}

		render() {
			const { loadMoreFunc } = this.props
			return (
                <div className="infinitescroll-container">
                    <Component { ...this.props } />
                </div>
            )
		}

		_handleScroll() {
            if (this._shouldLoadMore()) this.props.loadMoreFunc()
		}

		_shouldLoadMore() {
            return (!this.props.isFetching) && (( this._windowHeight() + this._scrollTop()) >= ( this._documentContentHeight() - 400))
        }

		_scrollTop() {
			return (window.pageYOffset !== undefined) ? window.pageYOffset :
                (document.body || document.documentElement || document.body.parentNode).scrollTop
		}

		_windowHeight() {
			if (window.innerHeight !== undefined || window.innerHeight !== null) {
				return window.innerHeight
			} else {
				return Math.min(document.documentElement.clientHeight, document.documentElement.offsetHeight)
			}
		}

		_documentContentHeight() {
			return Math.max(
		        document.body.scrollHeight, document.documentElement.scrollHeight,
		        document.body.offsetHeight, document.documentElement.offsetHeight,
		        document.body.clientHeight, document.documentElement.clientHeight
		    )
		}
    }

	InfiniteScroll.propTypes = {
		loadMoreFunc: PropTypes.func.isRequired,
		isFetching: PropTypes.bool.isRequired
	}
}


export { withInfiniteScroll, LoadingSpinner }