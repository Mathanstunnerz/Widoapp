import Avatar from "@mui/material/Avatar";
import { Routes, Route, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SendIcon from "@mui/icons-material/Send";
import * as yup from "yup";
import { useFormik } from "formik";
import keygen from "keygenerator";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
export function Profile() {
  const usertoken = localStorage.getItem("user_id");
  const [editprofile, seteditprofile] = useState(false);
  const [imgupload, setimgupload] = useState();
  const [profile, setprofile] = useState([]);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [followers, setfollowers] = useState([]);
  const [following, setfollowing] = useState([]);
  const [userPost, setuserPost] = useState([]);
  const [postexpand, setpostexpand] = useState(false);
  const [expandcarddata, setexpandcarddata] = useState([]);
  const all = async () => {
    fetch(`https://wido-app-backend.vercel.app/Userprofile/${usertoken}`)
      .then((response) => response.json())
      .then((userdata) => {
        setprofile(userdata);
        setfollowers(userdata.followers);
        setfollowing(userdata.following);
        setuserPost(userdata.post);
      });
  };
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
  const ITEM_HEIGHT = 48;
  const logout = () => {
    handleClose();
    localStorage.clear();

    navigate("/");
  };
  const [openbackdrop, setopenbackdrop] = React.useState(false);

  const handleClickOpen = () => {
    setAnchorEl(null);
    setopenbackdrop(true);
    all();
  };

  const BackdrophandleClose = () => {
    setopenbackdrop(false);
    all();
  };
  const DeleteAccount = async () => {
    handleClose();
    await fetch(`https://wido-app-backend.vercel.app/Accountdelete/${usertoken}`, {
      method: "DELETE",
    });
    localStorage.clear();
    navigate("/");
  };
  const profilefollowing = () => {
    navigate("/Home/Following")
  }
 const profilefollowers = ()=>{
  navigate("/Home/Followers")
 }
  return (
    <div className="profile-container">
      <Dialog
        open={openbackdrop}
        onClose={BackdrophandleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete your wido account?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            All photos and information in your account will be deleted.Do you
            agree with this ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={BackdrophandleClose}>Disagree</Button>
          <Button onClick={DeleteAccount} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
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
          <div className="logout-container">
            <IconButton
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
              <MenuItem onClick={logout}>Logout</MenuItem>
              <MenuItem onClick={handleClickOpen}>Delete Account</MenuItem>
            </Menu>
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
                <h5 onClick={profilefollowers} className="follower">
                  followers<br></br>
                  <span className="followers-count">{followers.length}</span>
                </h5>
                <h5 onClick={profilefollowing} className="following-text">
                  following<br></br>
                  <span className="followers-count">{following.length}</span>
                </h5>
              </div>
              <div className="edit-profile-container">
                <button onClick={() => navigate("/Editprofile")}>
                  Edit Profile
                </button>
                <button onClick={() => navigate("/Addpost")}>Add Post</button>
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
      `https://wido-app-backend.vercel.app/postuser/likeupdate/${expandcarddata.post_id}/${usertoken}`,
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
        `https://wido-app-backend.vercel.app/postuser/commentupdate/${expandcarddata.post_id}/${usertoken}`,
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
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const Deletepost = async (expandcarddata) => {
    await fetch(
      `https://wido-app-backend.vercel.app/postdelete/${expandcarddata.post_id}/${usertoken}`,
      {
        method: "PUT",
      }
    );
    callback()
    
    setpostexpand(false);
    data()
  };
  const [captionexpand,setcaptionexpand] = useState(false)
  return (
    <div className={commant ?"post-expand-card-view-container active" :"post-expand-card-view-container"}>
      <img src={expandcarddata.url} alt="post-img" className="postimg" />

      <div className="post-card-expand-container">
        <div className="post-cardexpand-user-top-container">
          <Avatar src={profile.dp}  />
          <h3>{profile.name}</h3>
          <div className="logout-container">
            <IconButton
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
              <MenuItem onClick={() => Deletepost(expandcarddata)}>
                Delete
              </MenuItem>
            </Menu>
          </div>
        
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
  const deletecommand = async () => {
    await fetch(
      `https://wido-app-backend.vercel.app/postuser/commentdelete/${cmd.comment_id}/${usertoken}/${cmd.post_id}`,
      {
        method: "PUT",
      }
    );
    callback()
    setpostexpand(false)
    // console.log("response")
  };

  return (
    <div className="comments-text-expand">
      <span>
        <Avatar
          sx={{ width: "100%", height: "100%" }}
          src={cmdprofile.dp}
        />
      </span>
      <h3>{cmd.comment}</h3>
      <label>
        <DeleteIcon onClick={deletecommand} />
      </label>
    </div>
  );
}
