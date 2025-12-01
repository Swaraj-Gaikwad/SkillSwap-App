import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const SkillDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [skill, setSkill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingData, setBookingData] = useState({
        startTime: '',
        endTime: '',
        notes: ''
    });
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        fetchSkill();
    }, [id]);

    const fetchSkill = async () => {
        try {
            const response = await api.get(`/api/skills/${id}`);
            setSkill(response.data.skill);
        } catch (err) {
            setError('Failed to load skill details');
        } finally {
            setLoading(false);
        }
    };

    const handleBookSession = async (e) => {
        e.preventDefault();
        setBookingLoading(true);
        setError('');

        try {
            await api.post('/api/sessions', {
                skillId: id,
                startTime: bookingData.startTime,
                endTime: bookingData.endTime,
                notes: bookingData.notes
            });
            setBookingSuccess(true);
            setTimeout(() => {
                navigate('/profile');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to book session');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    if (!skill) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Skill not found</div>
            </div>
        );
    }

    const isOwner = user?.id === skill.owner?._id;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mb-6 text-primary-600 hover:text-primary-700"
                >
                    ← Back to Dashboard
                </button>

                <div className="card mb-8">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">{skill.title}</h1>
                        <span className={`px-3 py-1 rounded ${skill.level === 'beginner' ? 'bg-green-100 text-green-800' :
                                skill.level === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                                    skill.level === 'advanced' ? 'bg-purple-100 text-purple-800' :
                                        'bg-red-100 text-red-800'
                            }`}>
                            {skill.level}
                        </span>
                    </div>

                    <p className="text-gray-700 text-lg mb-6">{skill.description}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {skill.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Instructor</h3>
                        <p className="text-gray-700">{skill.owner?.name}</p>
                        <p className="text-gray-600 text-sm">{skill.owner?.email}</p>
                        {skill.owner?.bio && (
                            <p className="text-gray-600 mt-2">{skill.owner.bio}</p>
                        )}
                    </div>
                </div>

                {!isOwner && (
                    <div className="card">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Book a Session</h2>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {bookingSuccess && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                                Session booked successfully! Redirecting to your profile...
                            </div>
                        )}

                        <form onSubmit={handleBookSession} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={bookingData.startTime}
                                    onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                                    required
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={bookingData.endTime}
                                    onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                                    required
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes (optional)
                                </label>
                                <textarea
                                    value={bookingData.notes}
                                    onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                                    className="input"
                                    rows="3"
                                    placeholder="Any specific topics or questions?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={bookingLoading || bookingSuccess}
                                className="w-full btn btn-primary"
                            >
                                {bookingLoading ? 'Booking...' : 'Book Session'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillDetail;
