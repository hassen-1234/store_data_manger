import { getCurrentWindow } from "@tauri-apps/api/window";
import { Link } from "react-router-dom";
import { FaShoppingCart,FaSun,FaMoon } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { BiBarChart } from "react-icons/bi";
import { BiMenu } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import { useState,useEffect } from "react";

export default ()=>{
    const location = useLocation();
    const [menuOpen,setMenuOpen] = useState(true);
    const [theme,setTheme] = useState<string | null>("");

    useEffect(()=>{
        const getTheme = async ()=>{
            const theme = await getCurrentWindow().theme();
            setTheme(theme);
        }
        getTheme();
    },[])

    const modeHandler = async ()=>{
        try{
            const currentTheme = await getCurrentWindow().theme();
            await getCurrentWindow().setTheme(currentTheme === "light" ? "dark" : "light");
            setTheme(currentTheme === "light" ? "dark" : "light");
        }catch{
            
        }
    }
    const menuOpenChange = ()=>{
        setMenuOpen(!menuOpen);
    }

    return <>
        {!menuOpen && <BiMenu onClick={menuOpenChange} className="bg-indigo-800 w-10 h-10 p-1 shadow-lg shadow-indigo-800 rounded-full text-white mt-5 mr-3 hover:opacity-90 active:opacity-80 cursor-pointer"/>}
        {menuOpen && <nav className="items-center bg-indigo-800 border rounded-tl-3xl shadow-xl text-white font-bold flex flex-col h-full gap-3 min-w-48">
            <BiMenu onClick={menuOpenChange} className="text-3xl mt-5 self-start mr-3 hover:opacity-90 active:opacity-80 cursor-pointer"/>
            <Link to="/" className={`navigationBarLink ${location.pathname === "/" ? "navigationBarLinkVisit":""}`}><FaShoppingCart/> عرض السلع</Link>
            <Link to="/add" className={`navigationBarLink ${location.pathname === "/add" ? "navigationBarLinkVisit":""}`}><AiOutlinePlus/> إضافة سلعة</Link>
            <Link to="/edit" className={`navigationBarLink ${location.pathname === "/edit" ? "navigationBarLinkVisit":""}`}> <FiEdit/> تعديل سلعة</Link>
            <Link to="/statistics" className={`navigationBarLink ${location.pathname === "/statistics" ? "navigationBarLinkVisit":""}`}><BiBarChart/> إحصائيات</Link>
            <button onClick={modeHandler} className="text-3xl flex flex-col flex-1 justify-end mb-4 hover:opacity-90 active:opacity-40 cursor-pointer">{theme === "dark" ? <FaMoon/> : <FaSun/>}</button>
        </nav>}
    </>
}