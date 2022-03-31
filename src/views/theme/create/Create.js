import React, { useState } from 'react'
import { CSVLink } from 'react-csv'
import crypto from 'crypto'
import axios from 'axios'

import './create.css'

const Create = () => {
  const [hash, setHash] = useState()
  const [array, setArray] = useState()
  const [fileName, setFileName] = useState()
  const [data, setData] = useState('')
  const [dup, setDup] = useState(false)
  const [iden, setIden] = useState(false)

  const InformationColumn = ['id', 'phone', 'address_detail', 'address']

  const deDuplicate = async () => {

    const response = await axios.get('http://localhost:5000/read/' + fileName)
    if (response.data === null) {
      alert("before deDuplicating, you have to injest the file")
      return
    }

    const uniqueData = []
    array.forEach((data) => {
      if (!uniqueData.includes(data)) {
        uniqueData.push(data)
      }
    })

    setArray(uniqueData)
    const _hash = crypto.createHash('sha256').update(uniqueData.toString()).digest('hex')
    setData(uniqueData.toString())

    await axios.post('http://localhost:5000/add', {
      fileName,
      content: _hash,
      event: 'deduplicate',
    })
    setDup(true)
  }

  const deIdentify = async () => {

    const response = await axios.get('http://localhost:5000/read/' + fileName)
    if (response.data === null) {
      alert("before deIdentify, you have to injest the file")
      return
    }

    const removedInfo = []
    const indexList = []
    const list = array[0].split('\t')
    for (let i = 0; i < list.length; i++) {
      if (InformationColumn.includes(list[i])) {
        indexList.push(i)
      }
    }

    for (let i = 0; i < array.length - 1; i++) {
      const column = array[i].split('\t')
      var li = ""
      for (let j = 0; j < column.length; j++) {
        if (indexList.includes(j)) {
          continue
        }
        li += column[j] + ","
      }
      removedInfo.push(li)
    }
    setArray(removedInfo)
    const _hash = crypto.createHash('sha256').update(removedInfo.toString()).digest('hex')
    setData(removedInfo.toString())

    await axios.post('http://localhost:5000/add', {
      fileName,
      content: _hash,
      event: 'deIdentify',
    })
    setIden(true)
  }

  const onChange = (e) => {
    let file = e.target.files[0]
    let fileReader = new FileReader()

    fileReader.onload = () => {
      const data = fileReader.result
      const _array = data.split('\n')
      const _hash = crypto.createHash('sha256').update(data).digest('hex')
      setHash(_hash)
      setArray(_array)
      setFileName(file.name)
    }

    fileReader.readAsText(file)
  }

  const write = async () =>{
    const response = await axios.post('http://localhost:5000/track/tezos', {
      key:fileName,
      value:hash
    })

    console.log(response)
  }

  const read = async () =>{
    const response = await axios.get('http://localhost:5000/track/tezos/' + fileName)
    console.log(response)
  }

  return (
    <>
      <input type="file" onChange={onChange} />
      {array && (
        <>
          <div className="buttons">
            <button className="button duplicate" disabled={dup} onClick={deDuplicate}>Deduplicate</button>
            <button className="button identify" disabled={iden} onClick={deIdentify}>deIdentify</button>
            <button className="button write" onClick={write}>Write a hash value in tezos blockchain</button>
            <button className="button read" onClick={read}>Read</button>
            <CSVLink data={data} filename={fileName}>
              <button className="button download">Download</button>
            </CSVLink>
          </div>
          <div>Last Hash Value : {hash}</div>
          <div>
            {array.map((data, i) => {
              return <li key={i}>{i} : {data}</li>
            })}
          </div>
        </>
      )}
    </>
  )
}

export default Create
