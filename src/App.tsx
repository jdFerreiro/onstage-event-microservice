import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventsPage from './pages/events/index.tsx';


function App() {
   return (
     <Router>
       <Routes>
         <Route path="/events" element={<EventsPage />} />
       </Routes>
     </Router>
   );
}

export default App;
