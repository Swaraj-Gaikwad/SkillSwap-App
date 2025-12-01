import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Welcome to <span className="text-primary-600">SkillSwap</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
                        Connect with others to exchange skills, learn new things, and grow together.
                        Share what you know and discover what others can teach you.
                    </p>

                    <div className="flex gap-4 justify-center mb-16">
                        <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
                            Get Started
                        </Link>
                        <Link to="/login" className="btn btn-secondary text-lg px-8 py-3">
                            Login
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mt-20">
                        <div className="card text-center">
                            <div className="text-4xl mb-4">🎯</div>
                            <h3 className="text-xl font-semibold mb-2">Find Skills</h3>
                            <p className="text-gray-600">
                                Browse through hundreds of skills shared by our community members
                            </p>
                        </div>

                        <div className="card text-center">
                            <div className="text-4xl mb-4">💬</div>
                            <h3 className="text-xl font-semibold mb-2">Connect & Chat</h3>
                            <p className="text-gray-600">
                                Real-time chat to coordinate sessions and exchange knowledge
                            </p>
                        </div>

                        <div className="card text-center">
                            <div className="text-4xl mb-4">📅</div>
                            <h3 className="text-xl font-semibold mb-2">Book Sessions</h3>
                            <p className="text-gray-600">
                                Schedule learning sessions that work for both participants
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
