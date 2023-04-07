import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import SendIcon from '@mui/icons-material/Send';
import Avatar from '@mui/material/Avatar';
import { useState,useEffect} from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import * as yup from "yup";
import { useFormik } from "formik";
import keygen from "keygenerator";
export function Postcard({carddata, home ,refresh}) {
  const usertoken = localStorage.getItem("user_id");
  const navigate = useNavigate();
  const [captionexpand,setcaptionexpand] = useState(false)
  const [like, setlike] = useState(carddata.like);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const[profile,setprofile] = useState([])
  const [followingCheck,setfollowingCheck]= useState([])
  const [follow,setfollow] = useState(true)

   

  const all = async () => {
   await fetch(`https://widobackend.onrender.com/Userprofile/${carddata.user_id}`)
      .then((response) => response.json())
      .then((userdata) => {
        setprofile(userdata)
     
        // console.log(userdata)
      });
      await fetch(`https://widobackend.onrender.com/Checkfollowing/${usertoken}/${carddata.user_id}`)
      .then((response)=>response.json())
      .then((followingcheck)=> setfollowingCheck(followingcheck))
  };
  const likebutton = async () => {
    setlike(like + 1);
    const likecount = {
      like: like,
    };
    await fetch(
      `https://widobackend.onrender.com/postuser/likeupdate/${carddata.post_id}/${carddata.user_id}`,
      {
        method: "PUT",
        body: JSON.stringify(likecount),
        headers: { "Content-Type": "application/json" },
      }
    );
    home()
  };
  
const [commant,setcommant] = useState(false)
  const comment =carddata.comments
  const formvalidation = yup.object({
    comment: yup.string().required(),
  });
  const Formik = useFormik({
    initialValues: { comment: "", comment_id: keygen._() , user_id:usertoken, post_id:carddata.post_id},
    validationSchema: formvalidation,
    onSubmit: async (dat, { resetForm }) => {
      // console.log(dat);
      await fetch(
        `https://wido-app-backend.vercel.app/postuser/commentupdate/${carddata.post_id}/${carddata.user_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dat),
        }
      );
      resetForm({ dat: "" });
      home()
      setcommant(false);
    },
  });
  
  const following =async  ()=>{
    setfollow(!follow)
    const follow1={
      follower_id: localStorage.getItem("user_id"),
      follow_id: keygen._(),
      follow_check: true
    }
    if(followingCheck.message === "follow" ){
      await fetch(`http://localhost:4777/folowers/${carddata.user_id}/${usertoken}`,{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(follow1),
       })
    }else{
      await fetch(`https://wido-app-backend.vercel.app/folowing2/remove/${localStorage.getItem("user_id")}/${carddata.user_id}`,{
        method:"PUT",
         })
    }
   
   all()
   refresh()
  }
  const develop= async ()=>{
   localStorage.setItem("user_visite",carddata.user_id)
    navigate("/Home/Profilevisit")
  }
  useEffect(()=>{
     all()
  },[])
  return <div className='Postcard-container' >
    <img src={carddata.url} alt="post-img" className='postimg' />
    <div className='post-card-right-container'>
    <div className='post-user-top-container'>
      <Avatar src={profile.dp}  onClick={develop} />
       <h3>{profile.name}</h3>
      {usertoken === carddata.user_id ? null : <div className='following-button-container'><button  className='follow-button' onClick={following}>{followingCheck.message === "follow" ? "follow":"following"}</button> </div> }
    </div>
  <div className={captionexpand ?"card-expand-caption active" :"card-expand-caption"}>
      <h5 onClick={()=>setcaptionexpand(!captionexpand)} className={captionexpand ?"card-caption active" :"card-caption"}>{carddata.caption}</h5>
        {captionexpand ? null  : <div>{carddata.caption.length > 40 ? <p  onClick={()=>setcaptionexpand(!captionexpand)} >...More</p> : null} </div>}
  </div>
    <h2 className='comments'>Comments</h2>
    <div className={commant ?'commant-container active' :'commant-container'} onClick={()=>setcommant(false)}>
     {comment.map((commentdata,index)=><CardComment key={index} commentdata={commentdata}  home={home} all={all} />)} 
     
    </div>
      <div className={commant ?'post-card-like-container active' :'post-card-like-container'}>
        <span><FavoriteBorderIcon  onClick={likebutton}/>
        <h6>{like} likes</h6>
        </span>
        <span><ChatBubbleOutlineRoundedIcon onClick={()=>setcommant(true)}/></span>
        <span> <SendIcon/></span>
      </div>
      <form  className={commant ? 'command-input-container active' :'command-input-container'}  onSubmit={Formik.handleSubmit}>
         <input type='text' className='command-input' placeholder="commant"    defaultValue={Formik.values.comment} name="comment" onChange={Formik.handleChange}/>
         <button className="comment-send-icon-button" type="submit">
            {" "}
            <SendIcon />
          </button>
      </form>
    </div>
  </div>;
}
function CardComment({ commentdata, home}) {
  const usertoken = localStorage.getItem("user_id");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const ITEM_HEIGHT = 48;
  const [cmd, setcmd] = useState(commentdata);
  const [cmdprofile, setcmdprofile] = useState([]);
  const fgg = async ()=>{
    await  fetch(`https://wido-app-backend.vercel.app/Userprofile/${cmd.user_id}`)
    .then((response) => response.json())
    .then((userdata) => setcmdprofile(userdata));
  }
useEffect(()=>{
  fgg()
},[])
  const deletecommand = async () => {
    await fetch(
      `https://wido-app-backend.vercel.app/commentdelete/${cmd.comment_id}/${usertoken}/${cmd.post_id}`,
      {
        method: "PUT",
      }
    );
    home()
  };

  return (
    <div className="Home-card-comments-text-expand">
      <span>
        <Avatar
          sx={{ width: "100%", height: "100%" }}
          src={cmdprofile.dp}
        />
      </span>
      <h3>{cmd.comment}</h3>
    
       {usertoken === cmd.user_id ?  <label><IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: "20ch",
                },
              }}
            >
              <MenuItem onClick={deletecommand}>Delete</MenuItem>
             
            </Menu></label> :null} 
      
      
    </div>
  );
}
