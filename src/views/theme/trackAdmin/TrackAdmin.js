import React, { useState } from 'react'

import './trackAdmin.css'

const TrackAdmin = () => {

    const [itemNumber, setItemNumber] = useState()
    const [publicKey, setPublickey] = useState([])

    const pubReader = (e) =>{
        let file = e.target.files[0]
        let fileReader = new FileReader()

        fileReader.onload = () =>{
            const data = fileReader.result
            setPublickey([...publicKey, data])
            console.log(publicKey)
        }

        fileReader.readAsText(file)
    }

    const create = () =>{
        
    }

    return (
        <>
            <div className="item">
                <input placeholder="item-serial-number" onChange={(e) => setItemNumber(e.target.value)} />
            </div>
            <div className="pub">
                <input type="file" placeholder="your public key" onChange={pubReader} />
            </div>
            <div className="pub">
                <input type="file" placeholder="your public key" onChange={pubReader} />
            </div>
            <div className="pub">
                <input type="file" placeholder="your public key" onChange={pubReader} />
            </div>
            <button onClick={create}>Create</button>
        </>

    )
}

export default TrackAdmin
