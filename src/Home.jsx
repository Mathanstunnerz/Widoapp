import { useState,useEffect} from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { Link, Navigate, Outlet } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';

import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
export function Home() {
  const usertoken2 = localStorage.getItem("user_visite");
  const usertoken = localStorage.getItem("user_id");
  const [profile, setprofile] = useState([]);
  const [homedata,sethomedata] = useState([])
  const [serachval, setsearchval] = useState([]);
  const navigate = useNavigate();
const home = async ()=>{
  await fetch("https://widobackend.onrender.com/Searchbar",{
    method: "GET",
  })
  .then((response)=> response.json())
  .then((data)=> sethomedata(data))
}
  useEffect( () => {
     fetch(`https://widobackend.onrender.com/Userprofile/${usertoken}`)
      .then((response) => response.json())
      .then((userdata) => {
        setprofile(userdata);
       
      });
      home()
  }, []);

  const searchvalue = (event) => {

    const serach = event.target.value;
    const database = homedata.filter((value) => {

      return value.name.toLowerCase().includes(serach.toLowerCase());

    });
    setsearchval(database);

  };
  return (<div className='Home-container'>
    <div className='home-top-navbar'>
      <img src="/wido.png" className='nav-logo' />
      <input type="text" placeholder='Search' className='search-bar' onChange={searchvalue} onBlur={()=>setsearchval('')} />
      <span className='search-icon'><SearchIcon /></span>
      {serachval.length !== 0 ? <div className='serach-drop-down' >
      {serachval.map((value) =><div className='searchbar' ><Avatar src={value.dp} /> <h3 className='searchvalue' >{value.name}</h3> </div>)}
      </div> : null}
    </div>

    <nav className='bottom-nav-bar'>
      <Link to="/Home"><span className='bottom-nav-icon'><HomeIcon className='router-icon'/></span></Link>
      <Link to=""><span className='bottom-nav-icon'><FavoriteIcon className='router-icon'/></span></Link>
      <Link to=""><span className='bottom-nav-icon'><MessageIcon className='router-icon'/></span></Link>
      <Link to="profile"><span className='bottom-nav-icon'><PersonIcon className='router-icon'/></span></Link>
    </nav>

    <div className='main-container'>

      <div className='side-navbar-container'>
         <div className='left-profile-container'>
            <span className='left-avatar'> 
             <Badge color="success" overlap="circular" badgeContent=" " variant="dot">
              <Avatar src={profile.dp}/>
              </Badge>
            </span>
            <h3 className='left-avatar-text'>{profile.name}</h3>
         </div>

      </div>

      <div className='home-content-container'>
        <Outlet />
      </div>

    </div>

  </div>);
}
export function Likepage() {
  return <div className='Likepage'>
    <h2>like page</h2>
  </div>;
}
export function Messagepage() {
  return <div className="massagepage">
    <h2>welcome to massage page</h2>
  </div>;
}

