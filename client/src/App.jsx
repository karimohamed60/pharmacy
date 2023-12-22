import AppRoutes from './routes/AppRoutes';
import { BrowserRouter as Router} from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App;