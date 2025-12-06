import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import type Database from "@tauri-apps/plugin-sql";
import { FaCopy, FaTrash, FaArrowDown, FaArrowUp, FaCheck } from "react-icons/fa";
import { BiMoney } from "react-icons/bi";
import { toast } from "react-hot-toast";
import  { useState,useEffect,useRef,Dispatch,SetStateAction } from "react";
import getDb from "../../db";

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

const TrieComponent = ({ sortOption,setSortOption,products,setProducts,setProductsLoading } : {sortOption : number,setSortOption : Dispatch<SetStateAction<number>>,products : Product[],setProducts : Dispatch<SetStateAction<Product[]>>,setProductsLoading : Dispatch<SetStateAction<boolean>> })=>{

    const [openTrie,setOpenTrie] = useState(false);

    const trieHandler = (optionNumber : number)=>{

        if (optionNumber === sortOption) return;
        setProductsLoading(true);

        const productsSort = products.sort((p1,p2)=>{
            if (optionNumber == 0 ) return p2.price - p1.price
            return p1.price - p2.price
        })

        setProducts(productsSort);
        setSortOption(optionNumber);
        setProductsLoading(false);
        setOpenTrie(!openTrie)
    }
    
    return <div className="relative">
    <button title="ترتيب" onClick={()=>{setOpenTrie(!openTrie)}} className="ml-2 mt-2 cursor-pointer hover:opacity-70 active:opacity-50">{sortOption === 0 ? <FaArrowDown className="text-2xl text-indigo-800"/> : <FaArrowUp className="text-2xl text-indigo-800"/>}</button>
    {openTrie && <ul className="flex flex-col gap-3 absolute z-10 w-52 bg-white/50 border top-8 left-1 p-3 rounded shadow-xl backdrop-blur-xl">
        <li onClick={()=>{trieHandler(0)}} className={`flex items-center gap-3 cursor-pointer ${sortOption === 1 ? "hover:opacity-60 active:opacity-50": ""}`}><FaArrowDown className="text-indigo-800"/>حسب السعر الأعلى {sortOption === 0 ? <FaCheck className="text-center text-green-500 mt-1"/> : ""}</li>
        <hr className="text-indigo-600"/>
        <li onClick={()=>{trieHandler(1)}} className={`flex items-center gap-3 cursor-pointer ${sortOption === 0 ? "hover:opacity-60 active:opacity-50": ""}`}><FaArrowUp className="text-indigo-800"/>حسب السعر الأدنى{sortOption === 1 ? <FaCheck className="text-center text-green-500 mt-1"/> : ""}</li>
    </ul>}
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
        getData();
    },[]);
    

    const searchHandler = async ()=>{
        setProductsLoading(true);
        if (db.current) {
            try{
            const sort = sortOption === 0 ? "DESC" : "ASC";
            const items : Product[] = await db.current.select(`SELECT * FROM product ${productName !== "" ? "WHERE name Like ? " : ""}ORDER BY price ${sort}`,[`${productName}%`]);
            console.log(items);
            setProducts(items);
            }catch{
                toast.error("خطأ");
            }
        }
        setProductsLoading(false);
    }

    const deleteHandler = async ( itemNumber:number )=>{
        try{
            const result: any = await db.current?.execute("DELETE FROM product WHERE number = ?",[itemNumber]);

            if (result.rowsAffected > 0) {

                // Product delete from array products
                const items = products.filter((product: Product) => product.number != itemNumber);
                setProducts(items);

                toast.success("تم الحذف");
            }else{
                toast.error("خطأ");
            }
        }catch{
            toast.error("خطأ");
        }
    }
    

    return <div className="flex flex-col mt-5 overflow-hidden h-full">
        <div className="flex mb-3 gap-3 items-center">
            <input type="search" placeholder="اسم السلعة" value={productName} onChange={(e)=>{setProductName(e.target.value)}} onKeyDown={async (e)=>{if (e.key == "Enter") await searchHandler()}} className="border rounded p-2 flex-1 max-w-xl dark:text-white dark:border-white dark:m-1"/>
            <button onClick={searchHandler} className="bg-indigo-800 text-white border p-2 rounded font-bold hover:opacity-90 active:opacity-80 cursor-pointer">بحث</button>
            <TrieComponent sortOption={sortOption} setSortOption={setSortOption} products={products} setProducts={setProducts} setProductsLoading={setProductsLoading}/>
        </div>

        {/* Appearance part */}
        <div className="flex-1 flex flex-col pb-7 mb-5 gap-4 overflow-y-auto h-72">
            {productsLoading 
            ? <div className="w-10 h-10 border-4 rounded-full animate-spin border-gray-300 border-t-indigo-600 self-center mt-60"></div> 
            : products.length > 0
            ? products.map((product,index)=><AppearanceElement key={index} name={product.name} price={product.price} itemNumbre={product.number} deleteFunction={deleteHandler}/>)
            : <span className="flex justify-center items-center h-full font-semibold text-xl drop-shadow-xl drop-shadow-indigo-800 dark:text-white">فارغ</span>
            }
        </div>
    </div>
}