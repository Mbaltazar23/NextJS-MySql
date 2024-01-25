import {
    conn
} from '@/libs/mysql';
import {
    NextResponse
} from 'next/server'
import {
    unlink
} from "fs/promises"
import 
    cloudinary
 from "@/libs/cloudinary"
import {
    processImage
} from '@/libs/processImage';


export async function GET() {

    try {
        const results = await conn.query("SELECT * FROM product")
        return NextResponse.json(results)
    } catch (error) {
        return NextResponse.json({
            'message': error.message
        }, {
            'status': 400
        })
    }
}

export async function POST(request) {
    try {
        const data = await request.formData()
        const image = data.get("image");
        /*console.log(data.get("name"),
            data.get("description"),
            data.get("price"), data.get("image"));*/

        if (!image) {
            return NextResponse.json({
                message: "Imagen requerida"
            }, {
                status: 400
            })
        }

        const filePath = await processImage(image)

        const res = await cloudinary.uploader.upload(filePath)
        console.log(res);

        if (res) {
            await unlink(filePath)
        }

        const result = await conn.query("INSERT INTO product SET ?", {
            name: data.get("name"),
            description: data.get("description"),
            price: data.get("price"),
            image: res.secure_url
        })

        console.log(result);

        return NextResponse.json({
            name: data.get("name"),
            description: data.get("description"),
            price: data.get("price"),
            id: result.insertId
        })
    } catch (error) {
        return NextResponse.json({
            'message': error.message
        }, {
            'status': 400
        })
    }
}