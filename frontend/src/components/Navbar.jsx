import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-bold text-primary-600">
                        SkillSwap
                    </Link>

                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600">
                                    Dashboard
                                </Link>
                                <Link to="/profile" className="text-gray-700 hover:text-primary-600">
                                    Profile
                                </Link>
                                <Link to="/chat" className="text-gray-700 hover:text-primary-600">
                                    Chat
                                </Link>
                                <span className="text-gray-600">Hi, {user?.name}</span>
                                <button onClick={logout} className="btn btn-secondary">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-secondary">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
