import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PropertyTable from "./PropertyTable";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PropertyTable />} />
                <Route path="/property/edit/:id" element={<PropertyTable />} />
                <Route path="/property/create" element={<PropertyTable />} />
            </Routes>
        </Router>
    );
}

export default App;
