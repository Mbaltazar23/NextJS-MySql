"use client"
import { useRouter, useParams } from "next/navigation"
import { useRef, useState, useEffect } from "react"
import axios from "axios"

function ProductForm() {
    const [product, setProduct] = useState({
        name: "",
        price: 0,
        description: ""
    })

    const [file, setFile] = useState(null)

    const form = useRef(null);
    const router = useRouter()
    const params = useParams()
    console.log(params);

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if (params.id) {
            axios.get("/api/products/" + params.id).then(res => {
                setProduct({
                    name: res.data.name,
                    price: res.data.price,
                    description: res.data.description
                })
            })
        }
    },[])



    const handleSubmit = async (e) => {
        e.preventDefault()
        //console.log(product);

        const formData = new FormData()

        formData.append("name", product.name);
        formData.append("price", product.price);
        formData.append("description", product.description);

        if (file) {
            formData.append("image", file);
        }

        if (!params.id) {

            const res = await axios.post('/api/products', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            console.log(res);
        } else {

            const res = await axios.put("/api/products/" + params.id, formData, {
                headers:{
                    "Content-Type": "multipart/form-data"
                }
            })
            console.log(res);

        }
        form.current.reset();
        router.push("/products")
        router.refresh();
    }

    return (
        <div className="flex ">
            <form className="bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit} ref={form}>
                <div className="text-black">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2 ">Nombre del Producto</label>
                    <input type="text" name="name" placeholder="Nombre" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3" value={product.name} autoFocus />
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2 ">Precio del Producto</label>
                    <input type="text" name="price" placeholder="00.00" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3" value={product.price} />
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2 ">Descripcion del Producto</label>
                    <textarea rows={3} name="description" placeholder="Descripcion" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3" value={product.description} />

                    <label htmlFor="productImage" className="block text-gray-700 text-sm font-bold mb-2 ">Imagen del Producto</label>

                    <input type="file" onChange={(e) => {
                        setFile(e.target.files[0]);
                    }} className="shadow appearance-none border rounded w-full py-2 px-3" />

                    {file && <img className="w-96 object-contain mx-auto my-4" src={URL.createObjectURL(file)} />}
                </div> 


                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{params.id ? "Actualizar Producto" : "Guardar Producto"}</button>
            </form>

        </div>
    )
}

export default ProductForm