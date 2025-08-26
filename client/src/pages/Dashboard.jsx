import { useEffect, useState } from 'react';

function Dashboard() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      setUserName(user.name);
    }
  }, []);

  return (
    <div>
      <h2>Welcome, {userName || 'User'} 👋</h2>
      {/* More dashboard content */}
    </div>
  );
}

export default Dashboard;
