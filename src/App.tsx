import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import "./App.css";
import getDb from "./db";
import NavBar from "./components/navBar";
import DisplayPart from "./pages/display/page";
import AddPart from "./pages/add/page";
import EditPart from "./pages/edit/page";
import StatisticsPart from "./pages/statistics/page";

function App() {

  useEffect(() => {
    const dbLoad = async ()=>{
      await getDb();
    }
    dbLoad()
  }, []);

  return <Router>
    <div className={`flex gap-4 h-screen transition-colors dark:bg-gray-900`}>
      <NavBar/>
      <main className="flex-1">
        <Toaster position="bottom-center"/>
        <Routes>
        <Route path="/" element={<DisplayPart/>}/>
        <Route path="/add" element={<AddPart/>}/>
        <Route path="/edit" element={<EditPart/>}/>
        <Route path="/statistics" element={<StatisticsPart/>}/>
        </Routes>
      </main>
    </div>
  </Router>
}

export default App;
