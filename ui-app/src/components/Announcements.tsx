import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Announcements.css';

const Announcements = () => {
    interface Announcement {
        id: number;
        subject: string;
        content: string;
        date_added: string;
        hourly_rate: number;
        author: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            phone_number?: string;
        };
    }
    
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    interface User {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone_number?: string;
        is_admin: boolean;
    }

    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    /** Pobiera listę ogłoszeń */
    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/announcements/', {
            });
            setAnnouncements(response.data);
        } catch (error) {
            console.error('Błąd pobierania ogłoszeń:', error);
        }
    };

    /** Pobiera dane zalogowanego użytkownika */
    const fetchUser = async () => {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            return;
        }
        try {
            const response = await axios.get('http://localhost:8000/api/user/me/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch {
            setUser(null);
        }
    };

    /** Usuwa ogłoszenie */
    const handleDelete = async (id: number) => {
        if (!window.confirm("Czy na pewno chcesz usunąć to ogłoszenie?")) return;
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            return;
        }
        try {
            await axios.delete(`http://localhost:8000/api/announcements/delete/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnnouncements(announcements.filter(a => a.id !== id));
        } catch (error) {
            console.error('Błąd podczas usuwania ogłoszenia:', error);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
        fetchUser();
    }, []);

    return (
        <div className="announcements-container">
            <button className="add-button" onClick={() => navigate(user ? "/add" : "/login")}>
                Add Announcement
            </button>

            <div className="announcements-grid">
                {announcements.map(announcement => (
                    <div key={announcement.id} className="announcement-card">
                        <div className="left-section">
                            <h3 className="subject">{announcement.subject}</h3>
                            <textarea className="content" readOnly value={announcement.content} />
                            <div className="bottom-info">
                                <span className="date">{announcement.date_added}</span>
                                <span className="price">{announcement.hourly_rate} zł/h</span>
                            </div>
                        </div>
                        <div className="right-section">
                            <img className="avatar" src="https://via.placeholder.com/50" alt="User Avatar" />
                            <p className="author-name">{announcement.author.first_name} {announcement.author.last_name}</p>
                            <p className="email">{announcement.author.email}</p>
                            {announcement.author.phone_number && <p className="phone">{announcement.author.phone_number}</p>}

                            {(user && (user.id === announcement.author.id || user.is_admin)) && (
                                <div className="admin-actions">
                                    <button className="edit-button" onClick={() => navigate(`/edit/${announcement.id}`)}>✏️</button>
                                    <button className="delete-button" onClick={() => handleDelete(announcement.id)}>🗑️</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Announcements;
