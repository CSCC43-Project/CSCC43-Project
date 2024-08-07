import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header({profile, logout}) {
    const navigate = useNavigate();

    function handleProfile(){
        navigate('/profile');
    }

    function handleHome(){
        navigate('/home');
    }

    function handleLogout(){
        navigate('/login');
    }

    return (
        <header className="header">
            <h1 className="header-title" onClick={handleHome}>InvestEase</h1>
            <nav>
                {profile === true && (
                    <button className="header-button" onClick={handleProfile}>Profile</button>
                )}
                {logout === true && (
                    <button className="header-button" onClick={handleLogout}>Logout</button>
                )}
            </nav>
        </header>
    );
}
export default Header;