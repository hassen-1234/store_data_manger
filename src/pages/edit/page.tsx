import { FaEdit,FaCheck,FaTimes } from "react-icons/fa";
import { BiMoney } from "react-icons/bi";
import { useState } from "react";

const AppareanceElement = ({ name,price }:{ name:string,price:string})=>{

    const [editMode,setEditMode] = useState(false);
    const [nameValue,setNameValue] = useState(name);
    const [priceValue,setPriceValue] = useState(price);

    const cancelhandler = ()=>{
        
        //API

        setEditMode(false);
    }
    const checkHandler = ()=>{
        
        //API

        setEditMode(false);
    }
    
    // API
    return <div className="relative flex flex-col gap-1.5 p-4 ml-1 border rounded-2xl shadow-md bg-white font-[Cairo] hover:shadow-lg transition dark:bg-gray-800">
          {!editMode ? <><h2 className="text-xl font-semibold text-gray-800 dark:text-white">🛍️ <span>{nameValue}</span></h2><p className="text-lg text-green-600 flex items-center gap-2"><BiMoney className="text-2xl text-green-600"/>   السعر: {priceValue} MRU</p></>
          : <><h2 className="text-xl font-semibold text-gray-800 dark:text-white">🛍️ <input value={nameValue} onChange={(e)=>{setNameValue(e.target.value)}} className="border rounded p-1 w-56"/></h2><p className="text-lg text-green-600 flex items-center gap-2"><BiMoney className="text-2xl text-green-600"/>   السعر: <span><input value={priceValue} onChange={(e)=>{setPriceValue(e.target.value)}} className="border rounded p-1 w-40"/> MRU</span></p></>}
          <FaEdit title="تعديل" onClick={()=>{setEditMode(!editMode)}} className={`absolute left-3 bottom-3 text-xl text-green-600 hover:opacity-70 active:opacity-60 cursor-pointer ${editMode ? "hidden":""}`}/>
          <div className={`flex gap-3 absolute left-3 bottom-3 ${editMode ? "":"hidden"}`}>
            <FaTimes title="إلغاء" onClick={cancelhandler} className="text-xl text-red-600 hover:opacity-70 active:opacity-60 cursor-pointer"/>
            <FaCheck title="حفظ" onClick={checkHandler} className="text-xl text-green-600 hover:opacity-70 active:opacity-60 cursor-pointer"/>
          </div>
        </div>
}

export default ()=>{
    return <div className="flex flex-col mt-5 ml-4 gap-3 h-full">
        <input type="search" placeholder="اسم أو رقم السلعة" className="border rounded p-2 max-w-xl dark:text-white"/> 
        
        {/* Item part */}
        <div className="flex flex-col flex-1 gap-4 overflow-y-auto h-72 pb-7">
            <AppareanceElement name="name" price="10"/>
        </div>
    </div>
}