import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';

export function Editprofile() {
  const navigate = useNavigate();
  const [dp, setdp] = useState([]);

  const [profile, setprofile] = useState([]);

  const usertoken = localStorage.getItem("user_id");
  useEffect(() => {
    fetch(`https://wido-app-backend.vercel.app/Userprofile/${usertoken}`)
      .then(response => response.json())
      .then(userdata => setprofile(userdata));
  }, []);

  const Formik = useFormik({
    initialValues: { name: profile.name, dp: "", Bio: "", },
    onSubmit: async (values) => {

      if (values.name === undefined) {
        const data = {
          name: profile.name,
          dp: values.dp,
          Bio: values.Bio
        };
        await fetch(`https://wido-app-backend.vercel.app/Profileupdate/${usertoken}`, {
          method: "PUT",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" }
        });
        console.log(data);
        navigate("/Home/profile");
      } else {
        console.log(values);
        await fetch(`https://wido-app-backend.vercel.app/Profileupdate/${usertoken}`, {
          method: "PUT",
          body: JSON.stringify(values),
          headers: { "Content-Type": "application/json" }
        });

        navigate("/Home/profile");
      }


    }
  });
  return <div className='addpost-container'>
    <form className='add-post-container' onSubmit={Formik.handleSubmit}>
      <div className='close-icon'><CloseIcon onClick={() => navigate("/Home/profile")} /></div>
      <input type="text" defaultValue={profile.name} className="edit-profile-add-post" placeholder='Add File' name="name" onChange={Formik.handleChange} />
      <input type="url" defaultValue={profile.dp} className="edit-profile-add-posT" placeholder='dp url' name="dp" onChange={Formik.handleChange} />
      <input type="text" defaultValue={profile.Bio} className="edit-profile-add-posT" placeholder='Bio' name="Bio" onChange={Formik.handleChange} />
      <span><button className="edit-profile-add-submit" type="submit">Post</button></span>
    </form>
  </div>;
}
