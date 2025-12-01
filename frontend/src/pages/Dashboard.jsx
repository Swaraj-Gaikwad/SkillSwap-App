import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await api.get('/api/skills');
            setSkills(response.data.skills);
        } catch (err) {
            setError('Failed to load skills');
        } finally {
            setLoading(false);
        }
    };

    const filteredSkills = skills.filter(skill =>
        skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading skills...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Available Skills</h1>
                    <Link to="/skills/new" className="btn btn-primary">
                        + Add Skill
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search skills by title, description, or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input max-w-2xl"
                    />
                </div>

                {filteredSkills.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No skills found. Be the first to add one!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSkills.map((skill) => (
                            <Link
                                key={skill._id}
                                to={`/skills/${skill._id}`}
                                className="card hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-semibold text-gray-900">{skill.title}</h3>
                                    <span className={`px-2 py-1 text-xs rounded ${skill.level === 'beginner' ? 'bg-green-100 text-green-800' :
                                            skill.level === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                                                skill.level === 'advanced' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-red-100 text-red-800'
                                        }`}>
                                        {skill.level}
                                    </span>
                                </div>

                                <p className="text-gray-600 mb-4 line-clamp-2">{skill.description}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {skill.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="text-sm text-gray-500">
                                    by {skill.owner?.name || 'Unknown'}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
