import './App.css';
import { BrowserRouter as Router, Switch} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute'
import { createContext, useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';

export const HomeContext = createContext(null);

function App() {
  const [userData,setUserData] = useState({});
  const [showUserImg, setShowUserImg] = useState(false);
  const [token, setToken] = useState(localStorage["Token"] ? true : false);

  useEffect( async () => {
    const getData = async () => {
      if (localStorage["Token"]) {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "x-access-token": localStorage["Token"]
          }
        }

        const res = await fetch('/api/home/dashboard', options);
        const data = await res.json();

        setUserData(data)

        if (data.message) {
          localStorage["Token"] = "";
        } 
      }
    }
    await getData();
  }, []);



  function handleSetToken(token) {
    if (token) {
      localStorage["Token"] = token;
      setToken(true);
    } else {
      localStorage["Token"] = "";
      setToken(false);
    }
  }

  return (
    <Router>
      <Switch>
        <HomeContext.Provider value={{ token, handleSetToken, userData, setUserData, showUserImg, setShowUserImg }}>
          <ProtectedRoute path="/" component={Dashboard} />
          <ProtectedRoute path="/login" isAuth component={Login} />
          <ProtectedRoute path="/register" isAuth component={Register} />
        </HomeContext.Provider>
      </Switch>
    </Router>   
  );
}     

export default App;