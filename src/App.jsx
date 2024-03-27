import { useState } from "react";
import { productList } from "./data";

const changeLocal=(amount)=>{
  const locale= navigator.language
  const formattedCurrency = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD', // Change currency code as needed
  }).format(amount);
  return formattedCurrency
}

const calculateTotalAmount=(productArr,discount)=>{
  const subtotal= productArr.reduce((acc,product)=>{
    return acc + (product.quantity * product.price)
  },0)
  
  const discountAmount= (subtotal * discount) /100

  const totalAmount  = subtotal - discountAmount;
  return totalAmount
}
const removeItemFromCart=(productArr, id)=>{
 return productArr?.filter((product)=> product?.id !== id)
}


function App() {
  changeLocal(240)
  const [products, setProduct] = useState(()=>{
    if(localStorage.getItem("products")){
      return JSON.parse(localStorage.getItem("products"));
    }else{
      localStorage.setItem("products",JSON.stringify(productList))
      return productList
    }
  });
  const [discount,setDiscount]=useState(0);
  const [totalAmount,setTotalAmount]= useState(()=>{
    return calculateTotalAmount(products,discount)
  })

  const handleQuantityChange = (e, id) => {
    const productsArr= JSON.parse(JSON.stringify(products))
    if(e.target.value <=0){
       const filterValue=removeItemFromCart(productsArr,id)
       console.log(filterValue)
       setProduct(filterValue)
       localStorage.setItem("products",JSON.stringify(filterValue))
       setTotalAmount(()=>{
        return calculateTotalAmount(filterValue,Number(discount));
      })
       return
    }
    productsArr.map((product)=>{
      if(product.id === id){
        product.quantity = Number(e.target.value)
      }
    })
    console.log("new product",productsArr)
    setProduct(productsArr);
    localStorage.setItem("products",JSON.stringify(productsArr))
    setTotalAmount(()=>{
      return calculateTotalAmount(productsArr,Number(discount));
    })
  };

  const handleDiscount=(e)=>{
    setDiscount(e.target.value)

    setTotalAmount(()=>{
     return  calculateTotalAmount(products,Number(e.target.value));
    })
  }
 
  const handleRemoveItem=(id)=>{
    const filterValue=removeItemFromCart(products,id)
    console.log(filterValue)
    setProduct(filterValue)
    localStorage.setItem("products",JSON.stringify(filterValue))
    setTotalAmount(()=>{
     return calculateTotalAmount(filterValue,Number(discount));
   })
  }
  return (
    <div className="w-screen h-screen overflow-hidden">
      <h1 className="text-center text-3xl font-bold my-4">
        Product Shopping Cart 🛒
      </h1>
      <div className="w-full flex flex-col">
        <div className="flex flex-col items-center gap-4 h-1/3 mb-40">
          {products?.length > 0 ?products?.map((product) => {
            return (
              <div
                className="w-1/3 h-auto shadow-xl p-4 rounded-xl"
                key={product?.id}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xl font-semibold">{product?.name}</p>
                  <p className="text-xl font-medium">
                    
                     {changeLocal(product.price)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-4 items-center">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                      type="number"
                      placeholder="Quantity"
                      id="quantity"
                      name="quantity"
                      value={product?.quantity}
                      className="p-1 w-1/3 outline-none border-2 border-gray-300"
                      onChange={(e) => {
                        handleQuantityChange(e, product.id);
                      }}
                    />
                  </div>
                  <button className="px-3 py-2 text-white bg-red-700 rounded-xl" onClick={()=>{
                    handleRemoveItem(product.id)
                  }}>
                    Remove Item
                  </button>
                </div>
              </div>
            );
          }) : <h2 className="text-center font-medium text-2xl text-[#b3b2b2] mt-10">Their is not any item in your cart</h2>
        }
        </div>

        <div className="fixed bottom-2 w-full flex items-center justify-center">
          <div className="w-1/3 h-auto border-t-2 border-gray-300 p-4 rounded-xl bg-white">
            <div className="flex gap-4 items-center justify-between">
              <label htmlFor="discount" className="text-lg font-medium">Discount</label>
              <div className="flex items-center gap-2 text-lg font-medium">
              <input
                type="number"
                placeholder="Discount"
                min={0}
                max={100}
                id="discount"
                name="discount"
                value={discount}
                className="px-2 w-20 outline-none border-2 border-gray-300"
                onChange={handleDiscount}
              />
              %
              </div>
             
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-lg font-medium">Total Amount</p>
              <p className="text-lg font-medium">{changeLocal(totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
