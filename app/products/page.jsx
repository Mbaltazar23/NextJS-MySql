import axios from "axios"
import ProductCard from "../components/ProductCard";

async function loadProducts() {
    const { data } = await axios.get("http://localhost:3000/api/products")
    return data;
}

async function ProductsPage() {
    const products = await loadProducts()
    //console.log(products);
    return (
        <div className="grid gap-4 grid-cols-4 text-black">
            {products.map(product => (
                <ProductCard product={product} key={product.id} />

            ))}
        </div>
    )
}

export default ProductsPage