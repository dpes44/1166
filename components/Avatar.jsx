import React from 'react'


const Avatar = ({profilePhoto = '/images/avatar.png', active}) => {
    return (
        <div className="profile-picture-right">
            <img src={profilePhoto} />
            {active && <div className="status-circle"></div>}
        </div>
    )
}

export default Avatar