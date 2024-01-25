import Link from 'next/link'
import React from 'react'

function Navbar() {
    return (
        <nav className='bg-zing-900 text-white py-3 mb-2'>
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/">
                    <h6 className='text-2xl'>NextJS MySql CRUD</h6>
                </Link>
                <ul>
                    <li>
                        <Link href="/new" className='text-sky-500 hover:text-sky-400'>Nuevo
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar