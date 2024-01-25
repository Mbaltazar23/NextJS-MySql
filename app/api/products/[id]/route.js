import {
    conn
} from '@/libs/mysql';
import {
    NextResponse
} from 'next/server'

import {
    processImage
} from '@/libs/processImage';
import {
    unlink
} from "fs/promises"
import cloudinary from '@/libs/cloudinary';

export async function GET(request, {
    params
}) {
    // console.log(params);

    try {
        const result = await conn.query("SELECT * FROM product WHERE id = ?", [params.id])
        if (result.length === 0) {
            return NextResponse.json({
                'message': "Producto no encontrado"
            }, {
                'status': 400
            })
        }
        return NextResponse.json(result[0])
    } catch (error) {
        return NextResponse.json({
            'message': error.message
        }, {
            'status': 400
        })
    }
}

export async function DELETE(request, {
    params
}) {

    try {
        const result = await conn.query("DELETE FROM product WHERE id = ?", [params.id])

        if (result.affectedRows === 0) {
            return NextResponse.json({
                'message': "Producto no encontrado"
            }, {
                'status': 404
            })
        }

        return new Response(null, {
            status: 204
        })
    } catch (error) {
        return NextResponse.json({
            'message': error.message
        }, {
            'status': 400
        })
    }

}

export async function PUT(request, {
    params
}) {

    try {
        const data = await request.formData()

        const image = data.get("image");

        const updatedData = {
            name: data.get("name"),
            price: data.get("price"),
            description: data.get("description"),
        }
        /*console.log(data.get("name"),
            data.get("description"),
            data.get("price"), data.get("image"));*/

        if (!data.get("name")) {
            return NextResponse.json({
                message: "Nombre requerida"
            }, {
                status: 400
            })
        }


        if (image) {
            const filePath = await processImage(image)
            const res = await cloudinary.uploader.upload(filePath)
            updatedData.image = res.secure_url
            console.log(res);
            if (res) {
                await unlink(filePath)
            }
        }

        const result = await conn.query("UPDATE product SET ? WHERE id = ?", [
            updatedData, params.id
        ])

        console.log(result);

        if (result.affectedRows === 0) {
            return NextResponse.json({
                'message': "Producto no encontrado"
            }, {
                'status': 400
            })
        }

        const updatedProduct = await conn.query("SELECT * FROM product WHERE id = ?", [params.id])
        return NextResponse.json(updatedProduct[0])

    } catch (error) {
        return NextResponse.json({
            'message': error.message
        }, {
            'status': 400
        })
    }
}