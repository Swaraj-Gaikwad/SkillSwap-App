import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const NewSkill = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        level: 'intermediate'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
            await api.post('/api/skills', {
                title: formData.title,
                description: formData.description,
                tags: tagsArray,
                level: formData.level
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create skill');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mb-6 text-primary-600 hover:text-primary-700"
                >
                    ← Back to Dashboard
                </button>

                <div className="card">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Skill</h1>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="input"
                                placeholder="e.g., React Fundamentals"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                className="input"
                                rows="4"
                                placeholder="Describe what you'll teach..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tags (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="input"
                                placeholder="e.g., react, javascript, frontend"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Level
                            </label>
                            <select
                                value={formData.level}
                                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                className="input"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                                <option value="expert">Expert</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary"
                        >
                            {loading ? 'Creating...' : 'Create Skill'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewSkill;
