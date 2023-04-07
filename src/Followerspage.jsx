
import Avatar from "@mui/material/Avatar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function Followerspage() {

  const usertoken = localStorage.getItem("user_id");
  const [follower,setfollower] =useState([])
  const navigate = useNavigate()
  const backtoprofile =()=>{
   navigate("/Home/profile")
  }
  const allfollowing = async () => {
    fetch(`https://wido-app-backend.vercel.app/Userprofile/${usertoken}`)
      .then((response) => response.json())
      .then((userdata) => {
        setfollower(userdata.followers);
       
      });
  };
  useEffect(() => {
    allfollowing();
  }, []);
  return <div className='following-container'>
  <div className="back-icon">< ArrowBackIcon onClick={backtoprofile}/><h4>Back</h4></div>
  <div className='following-id-container'>
  {follower.map((followingdata,index)=><Following_id  key={index} followingdata={followingdata} allfollowing={allfollowing}/>)} 
  </div>
</div>;
}
function Following_id({followingdata,allfollowing}){
  const [userfolowingid,setuserfolowingid] = useState([])
  const all = async () => {
    fetch(`https://wido-app-backend.vercel.app/Userprofile/${followingdata.follower_id}`)
      .then((response) => response.json())
      .then((userdata) => {
      setuserfolowingid(userdata)
       
      });
  };
  const followingremove = async  ()=>{

   await fetch(`https://wido-app-backend.vercel.app/folowers/remove/${localStorage.getItem("user_id")}/${followingdata.follow_id}/${userfolowingid.usertoken}`,{
    method:"PUT",
   })
   allfollowing()
  }
  useEffect(() => {
    all();
  }, []);
  return <div className="Following-id">
       <span>
       <Avatar src={userfolowingid.dp}/>
       </span>
       <h2>
        mathankumar
       </h2>
        <button className="button" onClick={followingremove}>Remove</button>
  </div>
}