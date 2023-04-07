import { useState,useContext,createContext} from 'react'
import { Routes, Route,Navigate} from "react-router-dom";
import './App.css'
import { Home, Likepage, Messagepage } from './Home';
import { Homedashboard } from "./Homedashboard";
import { Login } from './Login';
import { Profile } from './Profile';
import { Addpost } from './Addpost';
import { Editprofile } from './Editprofile';
import { Followingpage } from './Followingpage';
import { Followerspage } from './Followerspage';
import { Profilevisit } from './Profilevisit';
const visiteData = createContext();
function App() {

  const [count, setCount] = useState(0)
  const [profilevisite,setprofilevisite] = useState([{mathan : "mathannkumar"}])
  // console.log(profilevisite)
  return (
    <visiteData.Provider value={[profilevisite,setprofilevisite]}>
    <div className="App">
      
     <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home/*" element={
        <Protection >
          <Home />
         </Protection>}>
           <Route index element={<Homedashboard />} />
           <Route path="Homedashboard" element={<Homedashboard />} />
           <Route path="like" element={<Likepage />} />
           <Route path="message" element={<Messagepage />} />
           <Route path="profile" element={<Profile />} />
           <Route path="Following" element={<Followingpage />} />
           <Route path="Followers" element={<Followerspage />} />
           <Route path="Profilevisit" element={<Profilevisit />} />
         
           <Route path="*" element={<NoMatch />} />
        </Route>
        <Route path="/Addpost" element={<Addpost />} />
        <Route path="/Editprofile" element={<Editprofile />} />
      </Routes>
      
    </div>
    </visiteData.Provider>
  )
}
function NoMatch(){
  return<div>
    <h2>nomatch</h2>
  </div>
}
function Protection({children}) {
  const token = localStorage.getItem('token')
  return  token ? (
    <section>{children}</section>
  ) : (
    <Navigate replace to="/" />
  );
}
export default App
