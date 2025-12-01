import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        skills: user?.skills?.join(', ') || ''
    });

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await api.get('/api/sessions');
            setSessions(response.data.sessions);
        } catch (err) {
            console.error('Failed to load sessions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            const response = await api.put('/api/users/profile', {
                name: formData.name,
                bio: formData.bio,
                skills: skillsArray
            });
            updateUser(response.data.user);
            setEditMode(false);
        } catch (err) {
            console.error('Failed to update profile:', err);
        }
    };

    const updateSessionStatus = async (sessionId, status) => {
        try {
            await api.patch(`/api/sessions/${sessionId}/status`, { status });
            fetchSessions();
        } catch (err) {
            console.error('Failed to update session:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="card">
                            {editMode ? (
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Bio
                                        </label>
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            className="input"
                                            rows="3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Skills (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.skills}
                                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                            className="input"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="submit" className="btn btn-primary flex-1">
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditMode(false)}
                                            className="btn btn-secondary flex-1"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{user?.name}</h2>
                                    <p className="text-gray-600 mb-4">{user?.email}</p>
                                    {user?.bio && <p className="text-gray-700 mb-4">{user.bio}</p>}

                                    <div className="mb-4">
                                        <h3 className="font-semibold text-gray-900 mb-2">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {user?.skills?.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-primary-100 text-primary-800 rounded"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <button onClick={() => setEditMode(true)} className="btn btn-primary w-full">
                                        Edit Profile
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="card">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Sessions</h2>

                            {sessions.length === 0 ? (
                                <p className="text-gray-600">No sessions booked yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {sessions.map((session) => (
                                        <div key={session._id} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-lg">{session.skill?.title}</h3>
                                                <span className={`px-2 py-1 text-sm rounded ${session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        session.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                            session.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-red-100 text-red-800'
                                                    }`}>
                                                    {session.status}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-2">
                                                {new Date(session.startTime).toLocaleString()} - {new Date(session.endTime).toLocaleString()}
                                            </p>

                                            <p className="text-gray-700 mb-3">
                                                With: {session.participants?.filter(p => p._id !== user?.id).map(p => p.name).join(', ')}
                                            </p>

                                            {session.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => updateSessionStatus(session._id, 'confirmed')}
                                                        className="btn btn-primary text-sm"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => updateSessionStatus(session._id, 'cancelled')}
                                                        className="btn btn-secondary text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
