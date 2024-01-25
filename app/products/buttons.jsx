"use client"

import axios from "axios"
import Link from "next/link";
import { useRouter } from "next/navigation"

function Buttons({ productId }) {

    const router = useRouter();

    return (
        <div className="flex gap-x-2 jusfity-end mt-2">
            <button className="text-white bg-red-500 hover:bg-red-700 py-2 px-3 rounded"
                onClick={async () => {
                    if (confirm("Desea Eliminar a este Producto ?")) {
                        const res = await axios.delete("/api/products/" + productId)
                        //console.log(res);
                        if (res.status === 204) {
                            router.push("/products")
                            router.refresh()
                        }
                    }
                }}>Eliminar</button>
            <Link className="text-white bg-gray-500 hover:bg-gray-700 py-2 px-3 rounded" href={`/products/edit/${productId}`}>Editar</Link>
        </div>)
}

export default Buttons