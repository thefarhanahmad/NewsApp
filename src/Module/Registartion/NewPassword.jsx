import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../../API'

const NewPassword = () => {
    const navigate = useNavigate()
    const [Password,setPassword] = useState("")
    const _id =  localStorage.getItem("id")
    const onSumbit = (e) => {
        e.preventDefault()
        axios.put(`${API_URL}/forgot`,{id:_id,Password}).then((data)=>{
        console.log(data)
        navigate(`/`)
        })
    }
  return (
    <div className="user-registration-form">
    <h1>Forgot Password</h1>
    <form onSubmit={onSumbit}>
      <label htmlFor="Email">New Password:</label>
      <input type="NewPassword" id="NewPassword" name="NewPassword" onChange={(e)=>setPassword(e.target.value)}/>
      <input type="submit"  />
    </form>
  </div>
  )
}

export default NewPassword