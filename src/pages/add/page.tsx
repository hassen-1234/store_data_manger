import { useState } from "react";
import toast from "react-hot-toast";
import getDb from "../../db";

export default ()=>{

    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");

    const addHandler = async (e: React.FormEvent<HTMLFormElement>)=>{
      
      e.preventDefault();

      try{
        const db = await getDb();
        const productNumberMax = (await db.select<{ productNumberMax : number | null }[]>("SELECT MAX(number) AS productNumberMax FROM product"))[0].productNumberMax ?? 0;
        await db.execute("INSERT INTO product(name,price,number) VALUES($1,$2,$3)",[productName,price,productNumberMax+1]);
        setProductName("");
        setPrice("");
        toast.success("تمت الإضافة");
      }catch(e){
        toast.error("خطأ\n المحاولة مرة أخرى ");
      }
    }

    return <form onSubmit={addHandler} className="flex flex-col gap-10 mt-14 md:max-w-[500px]">
        <h1 className="text-center font-semibold text-3xl drop-shadow-xl drop-shadow-indigo-800 dark:text-white">إضافة سلعة</h1>
        <input required type="text" title="" placeholder="اسم السلعة" value={productName} onChange={(e)=>{setProductName(e.currentTarget.value)}} onInvalid={(e)=>{e.currentTarget.setCustomValidity("اسم السلعة")}} onInput={(e)=>{e.currentTarget.setCustomValidity("")}} className="border rounded p-2 ml-3 dark:text-white"/>
        <input required type="number" title="" placeholder="سعر السلعة (MRU)" value={price} onChange={(e)=>{setPrice(e.currentTarget.value)}} onInvalid={(e)=>{e.currentTarget.setCustomValidity("سعر السلعة")}} onInput={(e)=>{e.currentTarget.setCustomValidity("")}} className="border rounded p-2 ml-3 dark:text-white"/>
        <button type="submit" className="border rounded w-24 self-center p-3 cursor-pointer font-bold hover:bg-indigo-800 hover:text-white active:opacity-80 dark:text-white">إضافة</button>
    </form>
}