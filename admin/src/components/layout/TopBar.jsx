// Top bar component for admin dashboard
import { useAuth } from '../../context/AuthContext';

export const TopBar = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="top-bar">
      <h1>Admin Dashboard</h1>
      <div className="user-info">
        <span>{user?.email}</span>
        <button onClick={signOut}>Sign Out</button>
      </div>
    </div>
  );
};
