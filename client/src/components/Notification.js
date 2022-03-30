import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message }) => {
  if(message === null) {
    return null
  }

  const notificationStyle = {
    color: `${message.color}`,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={notificationStyle}>
      {message.text}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.object
}

export default Notification