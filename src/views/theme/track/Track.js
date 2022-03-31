import React, { useState } from 'react'
import crypto from 'crypto'

import "./track.css"
import axios from 'axios'

const Track = () => {

    const [hash, setHash] = useState()
    const [fileName, setFileName] = useState()
    const [check, setCheck] = useState(false)

    const getDataAndCheck = async () => {
        const response = await axios.get('http://localhost:5000/track/tezos/'+fileName)
        if(response.data===hash){
            setCheck(true)
        }else{
            setCheck(false)
            alert("Not Integrity")
            window.location.href="http://localhost:3000/#/theme/track"
            return
        }
    }

    const onChange = (e) =>{
        setCheck(false)
        let file = e.target.files[0]
        let fileReader = new FileReader()

        fileReader.onload = () =>{
            const data = fileReader.result
            const _hash = crypto.createHash('sha256').update(data).digest('hex')
            setHash(_hash)
            setFileName(file.name)
        }
        fileReader.readAsText(file)
    }

    return (
        <>
            <div className="item">
                <input type="file" onChange={onChange} />
                <button onClick={getDataAndCheck}>Check</button>
            </div>
            <div>
                {
                    check && 
                    <div>
                        <strong>Integrity Verification Successful!!</strong>
                        <div>Integrity : {hash}</div>
                    </div>
                }
            </div>
        </>

    )
}

export default Track
