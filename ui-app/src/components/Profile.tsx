import { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const [userData, setUserData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = sessionStorage.getItem('access_token');
            if (!token) return;
            
            try {
                const response = await axios.get('http://localhost:8000/api/user/me/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData({
                    email: response.data.email,
                    firstName: response.data.first_name,
                    lastName: response.data.last_name,
                    phone: response.data.phone_number
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        
        fetchUserData();
    }, []);

    const handleEdit = async () => {
        const confirmation = prompt('Type OK to confirm changes:');
        if (confirmation !== 'OK') return;
        
        const token = sessionStorage.getItem('access_token');
        if (!token) return;
        
        try {
            await axios.put('http://localhost:8000/api/user/edit/', userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-avatar">
                <img src="/assets/avatar.png" alt="User Avatar" className="avatar-image" />
            </div>
            <form className="profile-form">
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={userData.email} disabled className="form-input" />
                </div>
                <div className="form-group">
                    <label>First Name</label>
                    <input type="text" value={userData.firstName} 
                        onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                        disabled={!isEditing} className="form-input" />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" value={userData.lastName} 
                        onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                        disabled={!isEditing} className="form-input" />
                </div>
                <div className="form-group">
                    <label>Phone number (optional)</label>
                    <input type="text" value={userData.phone} 
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        disabled={!isEditing} className="form-input" />
                </div>
                <button type="button" className="edit-button" 
                    onClick={() => isEditing ? handleEdit() : setIsEditing(true)}>
                    {isEditing ? 'Save Changes' : 'Edit profile'}
                </button>
            </form>
        </div>
    );
};

export default Profile;