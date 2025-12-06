import type Database from "@tauri-apps/plugin-sql";
import { FaEdit,FaCheck,FaTimes } from "react-icons/fa";
import { BiMoney } from "react-icons/bi";
import { useState,useRef } from "react";
import { toast } from "react-hot-toast";
import getDb from "../../db";

interface Product {
    id : number;
    name : string;
    price : number
    number : number
}

const AppearanceElement = ({ name,price,productNumber,db }:{ name: string,price: number,productNumber:number,db: Database | null })=>{

    const [editMode,setEditMode] = useState(false);
    const [nameValue,setNameValue] = useState(name);
    const [nameValuePrev,setNameValuePrev] = useState("");
    const [priceValue,setPriceValue] = useState(price);
    const [priceValuePrev,setPriceValuePrev] = useState(0);

    const editHandler = ()=>{
        setNameValuePrev(nameValue);
        setPriceValuePrev(priceValue);
        setEditMode(!editMode);
    }

    const cancelhandler = ()=>{
        setNameValue(nameValuePrev);
        setPriceValue(priceValuePrev);
        setEditMode(false);
    }
    const checkHandler = async ()=>{

        // Validation
        if (!nameValue || !priceValue) return toast.error("ملأ الحقل");
        if (nameValue == nameValuePrev && priceValue == priceValuePrev) return setEditMode(false);
        
        try{
            if (db){

                const result = await db.execute("UPDATE product SET name = ? , price = ? WHERE number = ?",[nameValue,priceValue,productNumber]);
                
                if (result.rowsAffected > 0){
                    toast.success("تم الحفظ");
                    return setEditMode(false);
                }
                
                toast.error("خطأ");
            }
        }catch{
            toast.error("خطأ");
        }
    }
    
    return <div className="relative flex flex-col gap-1.5 p-4 ml-1 border rounded-2xl shadow-md bg-white font-[Cairo] hover:shadow-lg transition dark:bg-gray-800">
          {!editMode 
          ? <>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    🛍️ <span>{nameValue}</span>
                </h2>
                <p className="text-lg text-green-600 flex items-center gap-2">
                    <BiMoney className="text-2xl text-green-600"/>   السعر: {priceValue} MRU
                </p>
            </>
          : <>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    🛍️ <input value={nameValue} onChange={(e)=>{setNameValue(e.target.value)}} onKeyDown={async (e)=>{if (e.key == "Enter") await checkHandler()}} className="border rounded p-1 w-56"/>
                </h2>
                <p className="text-lg text-green-600 flex items-center gap-2">
                    <BiMoney className="text-2xl text-green-600"/>   السعر: <span><input value={priceValue} type="number" onChange={(e)=>{e.target.value ? setPriceValue(+e.target.value) : setPriceValue(NaN)}} onKeyDown={async (e)=>{if (e.key == "Enter") await checkHandler()}} className="border rounded p-1 w-40"/> MRU</span>
                </p>
            </>
            }
          <FaEdit title="تعديل" onClick={editHandler} className={`absolute left-3 bottom-3 text-xl text-green-600 hover:opacity-70 active:opacity-60 cursor-pointer ${editMode ? "hidden":""}`}/>
          <div className={`flex gap-3 absolute left-3 bottom-3 ${editMode ? "":"hidden"}`}>
            <FaTimes title="إلغاء" onClick={cancelhandler} className="text-xl text-red-600 hover:opacity-70 active:opacity-60 cursor-pointer"/>
            <FaCheck title="حفظ" onClick={checkHandler} className="text-xl text-green-600 hover:opacity-70 active:opacity-60 cursor-pointer"/>
          </div>
        </div>
}

export default ()=>{

    const [products, setProducts] = useState<Product[]>([]);
    const [productsLoading,setProductsLoading] = useState(false);
    const [searchTerm,setSearchTerm] = useState("");
    const db = useRef<Database | null>(null);

    const getData = async () => {
            
            if (!searchTerm) return;

            try{
            toast.remove();
            setProductsLoading(true);
            db.current = await getDb();
            const items : Product[] = await db.current.select("SELECT * FROM product WHERE name LIKE ? OR price LIKE ?",[`${searchTerm}%`,searchTerm]);
            setProducts(items);
            } catch{
                toast.dismiss();
                toast.custom(()=> {
                return <div className="flex justify-between p-2 w-52 bg-white rounded border shadow-xl dark:bg-gray-800 dark:text-white">
                    <span className="text-red-600">❌ خطأ</span>
                    <button onClick={getData} className="font-bold cursor-pointer hover:opacity-60 active:opacity-50">إعادة المحاولة</button>
                </div>},{duration : Infinity});
            } finally{
                setProductsLoading(false);
            }
        }

    return <div className="flex flex-col mt-5 ml-4 gap-3 h-full">
        <div className="flex mb-3 gap-3 items-center">
            <input type="search" placeholder="اسم أو رقم السلعة" onChange={(e) => {setSearchTerm(e.target.value)}} onKeyDown={async (e)=>{if (e.key == "Enter") await getData()}} value={searchTerm} className="border rounded p-2 flex-1 max-w-xl dark:text-white dark:border-white dark:m-1"/> 
            <button onClick={getData} className="bg-indigo-800 text-white border p-2 rounded font-bold hover:opacity-90 active:opacity-80 cursor-pointer">بحث</button>
        </div>
        
        {/* Item part */}
        <div className="flex flex-col flex-1 gap-4 overflow-y-auto h-72 pb-7">
            {productsLoading 
            ? <div className="w-10 h-10 border-4 rounded-full animate-spin border-gray-300 border-t-indigo-600 self-center mt-60"></div> 
            : products.length > 0 
            ? products.map((product,index)=><AppearanceElement key={index} name={product.name} price={product.price} productNumber={product.number} db={db.current}/>)
            : <span className="flex justify-center items-center h-full font-semibold text-xl drop-shadow-xl drop-shadow-indigo-800 dark:text-white">فارغ</span>
            }
        </div>
    </div>
}