import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import Database from "@tauri-apps/plugin-sql";
import { FaCopy, FaTrash, FaArrowDown, FaArrowUp, FaSort, FaCheck } from "react-icons/fa";
import { BiMoney } from "react-icons/bi";
import { toast } from "react-hot-toast";
import  { useState,useEffect,useRef } from "react";
import getDb from "../../db"

interface Product {
    id : number;
    name : string;
    price : number
    number : number
}

const AppearanceElement = ({ name,price,itemNumbre,deleteFunction }:{ name:string,price:number,itemNumbre:number,deleteFunction:(itemNumbre : number)=>void } )=>{
    
    const itemNumbreCopy = async ()=>{

        try{
            await writeText(itemNumbre.toString());
            toast.success("تم نسخ رقم السلعة");
        }catch(e){
            toast.error("خطأ");
        }
    }
    
    return <div className="relative flex flex-col gap-1.5 p-4 ml-1 border rounded-2xl shadow-md bg-white font-[Cairo] hover:shadow-lg transition dark:bg-gray-800">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">🛍️ {name}</h2>
      <p className="text-lg text-green-600 flex items-center gap-2"><BiMoney className="text-2xl text-green-600"/>   السعر: {price} MRU</p>
      <p className="text-xl font-[Cairo] flex items-center gap-2 dark:text-white"><FaCopy title="نسخ رقم السلعة" onClick={itemNumbreCopy} className="cursor-pointer"/> رقم السلعة : {itemNumbre}</p>
      <FaTrash title="حذف السلعة" onClick={()=>{deleteFunction(itemNumbre)}} className="absolute left-3 bottom-3 text-lg text-red-700 hover:opacity-70 active:opacity-40 cursor-pointer"/>
    </div>
}

const TrieComponent = ({ sortOption,setSortOption } : {sortOption : number,setSortOption : React.Dispatch<React.SetStateAction<number>> })=>{

    const [openTrie,setOpenTrie] = useState(true);

    const trieHandler = ()=>{
        
    }
    
    return <div onClick={()=>{setOpenTrie(!openTrie)}} className="relative">
    <FaSort onClick={trieHandler} title="ترتيب" className="ml-1 text-xl rounded w-8 h-8 p-1.5 hover:opacity-70 active:opacity-60 cursor-pointer dark:text-white"/>
    {openTrie && <div className="flex flex-col gap-4 absolute z-10 w-48 bg-white/50 border top-6 left-1 p-3 rounded shadow-xl backdrop-blur-xl">
        <span className="flex items-center gap-2"><FaArrowDown/>حسب السعر الأعلى </span>
        <span className="flex items-center gap-2"><FaArrowUp/>حسب السعر الأدنى</span>
    </div>}
    </div>
}

export default ()=>{
    
    const db = useRef<Database | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [productName,setProductName] = useState("");
    const [productsLoading,setProductsLoading] = useState(false);
    const [sortOption,setSortOption] = useState(0);

    useEffect(()=>{
        const getData = async ()=>{
            
            try{
            toast.remove();
            setProductsLoading(true);
            db.current = await getDb();
            const items : Product[] = await db.current.select("SELECT * FROM product ORDER BY price DESC");
            setProducts(items);
            } catch(e){
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
        getData();
    },[])
    

    const searchHandler = async ()=>{
        setProductsLoading(true);
        if (db.current) {
            try{
            const sort = sortOption === 0 ? "DESC" : "ASC";
            const items : Product[] = await db.current.select("SELECT * FROM product WHERE name Like ? ORDER BY price ?",[`${productName}%`,sort]);
            setProducts(items);
            console.log(1);
            }catch{
                toast.error("خطأ")
            }
        }else{
            console.log(0);
        }
        setProductsLoading(false);
    }

    const deleteHandler = ( itemNumber:number )=>{
        // API
    }
    

    return <div className="flex flex-col mt-5 overflow-hidden h-full">
        <div className="flex mb-3 gap-3 items-center">
            <input type="search" placeholder="اسم السلعة" value={productName} onChange={(e)=>{setProductName(e.target.value)}} onKeyDown={async (e)=>{if (e.key == "Enter") await searchHandler()}} className="border rounded p-2 flex-1 max-w-xl dark:text-white dark:border-white dark:m-1"/>
            <button onClick={searchHandler} className="bg-indigo-800 text-white border p-2 rounded font-bold hover:opacity-90 active:opacity-80 cursor-pointer">بحث</button>
            <TrieComponent sortOption={sortOption} setSortOption={setSortOption}/>
        </div>

        {/* Appearance part */}
        <div className="flex-1 flex flex-col pb-7 mb-5 gap-4 overflow-y-auto h-72">
            {productsLoading 
            ? <div className="w-10 h-10 border-4 rounded-full animate-spin border-gray-300 border-t-indigo-600 self-center mt-60"></div> 
            : products.length > 0
            ? products.map((product,index)=><AppearanceElement key={index} name={product.name} price={product.price} itemNumbre={product.number} deleteFunction={deleteHandler}/>)
            : <span className="flex justify-center items-center h-full font-semibold text-xl drop-shadow-xl drop-shadow-indigo-800 dark:text-white">فارغ</span>}
        </div>
    </div>
}