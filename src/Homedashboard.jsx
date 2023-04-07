import { Postcard } from './Postcard';
import { useState, useEffect } from "react";
export function Homedashboard() {

  const [homedata,sethomedata] = useState([])
const home = async ()=>{
  await fetch("https://widobackend.onrender.com/Homeitem",{
    method: "GET",
  })
  .then((response)=> response.json())
  .then((data)=> sethomedata(data))
}
  useEffect(()=>{
    home ()
  },[])

  const refresh = ()=>{
    home()
    // console.log("Refreshing")
  }

  return <div className='Homedashboard-container'>
    <div className='Homedashboard-inside-container'>
      { homedata.map((carddata,index)=><Postcard key={index} carddata={carddata}  home={home} refresh={refresh}/>)}
    <div>
      
    </div>
    </div>

  </div>;
}

