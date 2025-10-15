import { BrowserRouter, Routes, Route } from "react-router-dom";
import SuperBarreiras from "./pages/SuperBarreiras";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SuperBarreiras />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;