
import Avatar from "@mui/material/Avatar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
export function Followingpage() {
  const usertoken = localStorage.getItem("user_id");
  const [following,setfollowing] =useState([])
  const navigate = useNavigate()
  const backtoprofile =()=>{
   navigate("/Home/profile")
  }
  const allfollowing = async () => {
    fetch(`https://wido-app-backend.vercel.app/Userprofile/${usertoken}`)
      .then((response) => response.json())
      .then((userdata) => {
        setfollowing(userdata.following);
       
      });
  };
  useEffect(() => {
    allfollowing();
  }, []);
  return <div className='following-container'>
    <div className="back-icon">< ArrowBackIcon onClick={backtoprofile}/><h4>Back</h4></div>
    <div className='following-id-container'>
    {following.map((followingdata,index)=><Following_id  key={index} followingdata={followingdata} allfollowing={allfollowing}/>)} 
    </div>
  </div>;
}

function Following_id({followingdata,allfollowing}){
  const [userfolowingid,setuserfolowingid] = useState([])
  const all = async () => {
    fetch(`https://wido-app-backend.vercel.app/Userprofile/${followingdata.following_id}`)
      .then((response) => response.json())
      .then((userdata) => {
        setuserfolowingid(userdata)
       
      });
  };
  const followingremove = async  ()=>{

   await fetch(`https://wido-app-backend.vercel.app/folowing/remove/${localStorage.getItem("user_id")}/${followingdata.follow_id}/${userfolowingid.usertoken}`,{
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
      {userfolowingid.name}
       </h2>
        <button className="button" onClick={followingremove}>Unfollow</button>
  </div>
}