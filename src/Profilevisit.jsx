
import Avatar from "@mui/material/Avatar";
import { Routes, Route, useNavigate} from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, useEffect , useContext } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SendIcon from "@mui/icons-material/Send";
import * as yup from "yup";
import { useFormik } from "formik";
import keygen from "keygenerator";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
export function Profilevisit(){
  const usertoken2 = localStorage.getItem("user_visite");
  const usertoken = localStorage.getItem("user_id");
  const [profile, setprofile] = useState([]);
  const [followingCheck,setfollowingCheck]= useState([])
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [followers, setfollowers] = useState([]);
  const [following, setfollowing] = useState([]);
  const [userPost, setuserPost] = useState([]);
  const [postexpand, setpostexpand] = useState(false);
  const [expandcarddata, setexpandcarddata] = useState([]);
  const [follow,setfollow] = useState(true)
  const all = async () => {
    if(usertoken ===usertoken2 ){
      navigate("/Home/profile")
    }else{
      await fetch(`https://wido-app-backend.vercel.app/Userprofile/${usertoken2}`)
      .then((response) => response.json())
      .then((userdata) => {
        setprofile(userdata);
        setfollowers(userdata.followers);
        setfollowing(userdata.following);
        setuserPost(userdata.post);
      });
      await fetch(`https://wido-app-backend.vercel.app/Checkfollowing/${usertoken}/${usertoken2}`)
      .then((response)=>response.json())
      .then((followingcheck)=> setfollowingCheck(followingcheck))
    }
   
  };
  const following2 =async  ()=>{
    setfollow(!follow)
    const follow1={
      follower_id: localStorage.getItem("user_id"),
      follow_id: keygen._(),
      follow_check: true
    }
    if(followingCheck.message === "follow" ){
      await fetch(`https://wido-app-backend.vercel.app/folowers/${usertoken2}/${usertoken}`,{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(follow1),
       })
    }else{
      await fetch(`https://wido-app-backend.vercel.app/folowing2/remove/${localStorage.getItem("user_id")}/${usertoken2}`,{
        method:"PUT",
         })
    }
   
   all()
   refresh()
  }
  const callback =()=>{
    all();
  }
  useEffect(() => {
    all();
  
  }, []);
  const postcardexpand = (data) => {
    all();
    setpostexpand(true);
    setexpandcarddata(data);

  };
  const postexpandcontainer = (all) => {
    setpostexpand(false);
    all();
  };
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  
  return (
    <div className="profile-container">
        
      {postexpand ? (
        <div className="post-expand-main-container">
          <div className="close-icon-post-expand">
            <ArrowBackIcon onClick={() => postexpandcontainer(all)} />{" "}
            <h2>Post</h2>
          </div>
          <div className="post-expand-container">
            <Postexpandcard
              setpostexpand={setpostexpand}
              expandcarddata={expandcarddata}
              profile={profile}
              
              callback={callback}
            />
          </div>
        </div>
      ) : (
        <div className="profile-dashboard">
         <div className="close-icon-post-expand">
            <ArrowBackIcon onClick={() =>navigate("/Home")} />
            <h2>Back</h2>
          </div>
          <div className="profile-picture-container">
            <div className="profile-img">
              <span className="profile-avatar">
                <Avatar
                  alt="Travis Howard"
                  src={profile.dp}
                  sx={{ width: 150, height: 150 }}
                />
              </span>
              <h2>{profile.name}</h2>
              <h5>{profile.Bio}</h5>
            </div>
            <div className="followers-container">
              <div className="followers-text">
                <h5  className="follower">
                  followers<br></br>
                  <span className="followers-count">{followers.length}</span>
                </h5>
                <h5 className="following-text">
                  following<br></br>
                  <span className="followers-count">{following.length}</span>
                </h5>
              </div>
              <div className="edit-profile-container">
            
                <button  onClick={following2}>{followingCheck.message === "follow" ? "follow":"following"}</button>
                <button>Message</button>
              </div>
            </div>
          </div>
          <hr></hr>
          <div className="postcontainer">
            {userPost.map((post,index) => (
              <Profilepostcard data={post} key={index} postcardexpand={postcardexpand} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
function Profilepostcard({ data, postcardexpand,callback}) {
  return (
    <div className="postcard-container" onClick={() => postcardexpand(data)}>
      <img src={data.url} alt="post-img" className="post-img" />
    </div>
  );
}
function Postexpandcard({ expandcarddata, profile, setpostexpand,callback}) {
  const [commant, setcommant] = useState(false);
  const usertoken2 = localStorage.getItem("user_visite");
  const ITEM_HEIGHT = 48;
  const comment = expandcarddata.comments;
  const usertoken = localStorage.getItem("user_id");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [like, setlike] = useState(expandcarddata.like);
  const likebutton = async () => {
    setlike(like + 1);
    const likecount = {
      like: like,
    };
    await fetch(
      `https://wido-app-backend.vercel.app/postuser/likeupdate/${expandcarddata.post_id}/${usertoken2}`,
      {
        method: "PUT",
        body: JSON.stringify(likecount),
        headers: { "Content-Type": "application/json" },
      }
    );
  };
  const formvalidation = yup.object({
    comment: yup.string().required(),
  });
  const Formik = useFormik({
    initialValues: { comment: "", comment_id: keygen._(),user_id:usertoken , post_id:expandcarddata.post_id},
    validationSchema: formvalidation,
    onSubmit: async (dat, { resetForm }) => {
      console.log(dat);
      await fetch(
        `http://localhost:4777/postuser/commentupdate/${expandcarddata.post_id}/${usertoken2}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dat),
        }
      );
      callback();
      resetForm({ dat: "" });
      setcommant(false);
      setpostexpand(false);
    },
  });

  const [captionexpand,setcaptionexpand] = useState(false)
  return (
    <div className={commant ?"post-expand-card-view-container active" :"post-expand-card-view-container"}>
      <img src={expandcarddata.url} alt="post-img" className="postimg" />

      <div className="post-card-expand-container">
        <div className="post-cardexpand-user-top-container">
          <Avatar src={profile.dp}  />
          <h3>{profile.name}</h3>
          
        </div>
        <div className={captionexpand ?"card-expand-caption active" :"card-expand-caption"}>
          <h5 onClick={()=>setcaptionexpand(!captionexpand)} className={captionexpand ?"card-caption active" :"card-caption"}>{expandcarddata.caption}</h5>
          {captionexpand ? null  :<div>  <p  onClick={()=>setcaptionexpand(!captionexpand)} >...More</p></div>}
        </div>
        <h2 className="comments">Comments</h2>
        <div
          className={
            commant
              ? "commant-container-exapand active"
              : "commant-container-exapand"
          }
          onClick={() => setcommant(false)}
        >
          {comment.map((hmg,index) => (
            <CardComment commentdata={hmg} key={index} setpostexpand={setpostexpand} callback={callback}/>
          ))}
        </div>
        <div
          className={
            commant
              ? "post-card-like-container active"
              : "post-card-like-container"
          }
        >
          <span>
            <FavoriteBorderIcon onClick={likebutton} />
            <h6>{like} likes</h6>
          </span>
          <span>
            <ChatBubbleOutlineRoundedIcon onClick={() => setcommant(true)} />
          </span>
          <span>
            {" "}
            <SendIcon />
          </span>
        </div>
        <form
          className={
            commant
              ? "command-input-container active"
              : "command-input-container"
          }
          onSubmit={Formik.handleSubmit}
        >
          <input
            type="text"
            className="command-input"
            defaultValue={Formik.values.comment}
            placeholder="commant"
            name="comment"
            onChange={Formik.handleChange}
          />
          <button className="comment-send-icon-button" type="submit">
            {" "}
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
}
function CardComment({ commentdata, setpostexpand,callback}) {
  const usertoken = localStorage.getItem("user_id");
  const navigate = useNavigate()
  const [cmd, setcmd] = useState(commentdata);
  const [cmdprofile, setcmdprofile] = useState([]);
 useEffect(()=>{
  fetch(`https://wido-app-backend.vercel.app/Userprofile/${cmd.user_id}`)
  .then((response) => response.json())
  .then((userdata) => setcmdprofile(userdata));
 },[]) 

  return (
    <div className="comments-text-expand">
      <span>
        <Avatar
          sx={{ width: "100%", height: "100%" }}
          src={cmdprofile.dp}
        />
      </span>
      <h3>{cmd.comment}</h3>
     
    </div>
  );
}
