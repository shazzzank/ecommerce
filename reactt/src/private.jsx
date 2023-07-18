import {useState, useEffect} from 'react';
import Udashboard from './pages/udashboard.jsx';
import Adashboard from './pages/adashboard.jsx';
import Home from './pages/home.jsx';
import axios from 'axios';

function Private() {
  const [isUser, setUser] = useState(false);
  const [isAdmin, setAdmin] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem('token');
		const object = {headers: {'Authorization': token}};
		if (token){
			axios.get('/node/user', object).then(res => setUser(res.data.ok));
			axios.get('/node/admin', object).then(res => setAdmin(res.data.ok));
		} else{ setUser(false); setAdmin(false); }
	}, []);

  return (
    <div>
      {isAdmin ? <Adashboard /> : isUser ? <Udashboard /> : <Home />}
    </div>
  );
}

export default Private;
