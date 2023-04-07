import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import keygen from "keygenerator";
import * as yup from "yup";
export function Addpost() {
  const navigate = useNavigate();
  const usertoken = localStorage.getItem("user_id")
  const formvalidation = yup.object({
    url: yup.string().required().url()
  });
  const Formik = useFormik({
    initialValues: { url: "", caption: "", post_id: keygen._(), user_id: usertoken, comments :[] ,like :0,},
    validationSchema :formvalidation ,
    onSubmit: async (values) => {
      await fetch(`https://wido-app-backend.vercel.app/UserProfilepost/${usertoken}`,{
        method : "PUT",
        body : JSON.stringify(values),
        headers: { "Content-Type": "application/json" }
      })
       navigate("/Home/profile")
    }
  });
  return <div className='addpost-container'>

    <form className='add-post-container' onSubmit={Formik.handleSubmit}>
       
      <div className='close-icon'><CloseIcon onClick={() => navigate("/Home/profile")} /></div>
      <div style={{color:"red"}}>{Formik.errors.url}</div>
      {/* <input type="file" className="edit-profile-add-post" placeholder='Add File' onChange={(file)=>setimgupload(file.target.value)}/> */}
      <input type="url" className="edit-profile-add-posT" placeholder='url' name="url" onChange={Formik.handleChange} />
      <input type="text" className="edit-profile-add-posT" placeholder='Caption' name="caption" onChange={Formik.handleChange} />
      <span><button className="edit-profile-add-submit" type="submit">Post</button></span>
    </form>
  </div>;
}
