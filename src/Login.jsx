import { useState } from "react";
import {useNavigate} from "react-router-dom";
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import * as yup from "yup";
export function Login() {
  const navigate = useNavigate()
  const [login,setlogin] = useState(true)
   const [loginloading,setloginloading] = useState(false)
  const [signupmsg,setsignupmsg] =useState(null)
  const [ loginCheck,setloginCheck] =useState(null)
  // const[Signupdata,setsignupdata] = useState([])
  // console.log(Signupdata)
  const formvalidation = yup.object({
    name: yup.string().required().min(4),
    password : yup.string().required()
  });
  const Formik = useFormik({
    initialValues : { name : '', password : ''},
    validationSchema : formvalidation,
    onSubmit :async (dat)=>{
      // console.log(dat)
      setloginloading(true)
      const data = await fetch("https://widobackend.onrender.com/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dat),
      });
      if (data.status === 401) {
        console.log("❌Error 401");
        setloginCheck("401 Error");
        localStorage.clear();
        setloginloading(false)
      } else {
        if (data.status === 400) {
          setloginCheck("invalid credentials");
          localStorage.clear();
          setloginloading(false)
        } else {
          setloginCheck(null);
          const result = await data.json();
          localStorage.setItem("token", result.token);
          localStorage.setItem("user_id", result.user_id);
          navigate("/Home")
          
        }
        // navigate("/profile");
      }
      
    }
    
  })
  const formvalidation2 = yup.object({
    name: yup.string().required().min(4),
    password : yup.string().required(),
    email : yup.string().required().email(),
    dateofbirth : yup.string().required(),
  });
  const{values,handleChange,handleSubmit,handleBlur,errors} = useFormik({
    initialValues : { name : '', password : '',email:'',dateofbirth:''},
    validationSchema : formvalidation2,
    onSubmit : async (data)=>{
      // console.log(data)
      setloginloading(true)
      const signupdata =  await fetch("https://widobackend.onrender.com/Signup",{
        method:"POST",
        headers : {'Content-Type': 'application/json'},
        body : JSON.stringify(data),
      })
      
      if(signupdata.status === 400){
        setsignupmsg("username already exists")
        console.log("username already exists")
        localStorage.clear();
        setloginloading(false)
      }else{
        console.log("fetch success")
        const result = await signupdata.json();
        localStorage.setItem('user_id',result.user_id)
        localStorage.setItem('token',result.token)
        setloginloading(false)
        navigate("/Home")
      }

    }
    
  })
  return (<div className='Login'>
       <div className="login-logo">
      <img className="logo-login" src="https://ik.imagekit.io/71sxn3xle/Frame_1.png?updatedAt=1679897130903"/>
  
       </div>
    {login ?<span>
  <form action="login-form" className="form-container" onSubmit={Formik.handleSubmit}>
      <h2>Login</h2>
      <span className="invalid-credentials">{loginCheck}</span>
      <span>{errors.name}</span>
      <input type='text' onChange={Formik.handleChange} placeholder="username" name='name' defaultValue={Formik.values.username}/>
      <input type='text' onChange={Formik.handleChange} placeholder="password" name='password' defaultValue={Formik.values.password}/>
      <button type="submit">Login</button>
      <h3 onClick={()=>setlogin(false)}>create account</h3>
      {loginloading ?  <div className="progress-line">
      <LinearProgress />
    </div>: null}
    </form>
    </span> :
    <span>
   
    <form action="login-form" className="form-container" onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <span>{signupmsg}</span>
      <input onChange={handleChange}  type='text' placeholder="name" name='name' />
      <input onChange={handleChange} type='text' placeholder="password" name='password' />
      <input  onChange={handleChange} type='email' placeholder="email" name='email' />
      <input onChange={handleChange} type='date' placeholder="Date of birth" name='dateofbirth' />
      <button type="submit">Signup</button>
  
      <h3 onClick={()=>setlogin(true)}>Login</h3>
      {loginloading ?  <div className="progress-line">
      <LinearProgress />
    </div>: null}
    </form>
      </span>
}
  </div>);
}
