import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Product {
  productNumber: number;
  name: string;
  price: number;
}

const getColorByPrice = (price: number) => {
  if (price <= 50) return "#34d399"; // vert
  if (price <= 100) return "#fbbf24"; // jaune
  return "#f87171"; // rouge
};

export default () => {

  //API
  const products: Product[] = [
];

  const totalProducts = products.length;

  const totalPrice = useMemo(
    () => products.reduce((sum, p) => sum + p.price, 0),
    []
  );

  const averagePrice = useMemo(
    () => (totalProducts > 0 ? totalPrice / totalProducts : 0),
    [totalProducts, totalPrice]
  );

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 h-screen font-[Cairo]">
      {/* Statistics section */}
      <div className="bg-white border border-gray-300 shadow-md rounded-2xl p-3 w-full hover:shadow-xl dark:bg-gray-800 dark:border-none">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-white">
          📊 إحصائيات المنتجات
        </h2>

        <p className="text-gray-700 mb-2 dark:text-white">عدد المنتجات: {totalProducts}</p>
        <p className="text-gray-700 mb-2 dark:text-white">{totalProducts > 0 ? `المجموع الكلي: ${totalPrice} MRU` : ""}</p>
        <p className="text-gray-700 mb-4 dark:text-white">
          {totalProducts > 0 ?` متوسط السعر: ${averagePrice} MRU` : ""}
        </p>
      </div>

      {/* Graphic section */}
      <div className="bg-white border border-gray-300 shadow-md rounded-2xl p-6 w-full hover:shadow-xl flex-1 dark:bg-gray-800 dark:border-none">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center dark:text-white">
          🔘 توزيع الأسعار
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={products.map((p) => ({ name: p.name, price: p.price }))}
              dataKey="price"
              nameKey="name"
              outerRadius={120}
              label
            >
              {products.map((value, index) => (
                <Cell key={index} fill={getColorByPrice(value.price)} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}