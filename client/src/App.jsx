import AppRoutes from './routes/AppRoutes';
import { BrowserRouter as Router} from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {useEffect, useState} from 'react'
function App() {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
      if (isModalOpen) {
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
      return () => {
        document.body.classList.remove("no-scroll");
      };
  }, [isModalOpen]); 
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App;