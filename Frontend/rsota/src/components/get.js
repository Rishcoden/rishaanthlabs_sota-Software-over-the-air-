import React,{useState} from 'react'
import axios from 'axios'
import './get.css'


const Get = () => {
    const [updates,setUpdates] = useState([]);

    const fetchUpdates = async ()=>{
    const out = await axios.get("http://localhost:5000/getallupdates");
    setUpdates(out.data);
    console.log(out.data);

}
  return (
    <div className="container">
      <h2>Get Updates</h2>
      <button className="get-button" onClick={fetchUpdates}>Get Updates</button>
     <div className="updates-container">{updates.map((element,index)=>{
        return(
            <div className="update-box" key={index}>
               <h3>App Name: {element.name}</h3>
               <p>Build Type: {element.type}</p>
               <p>Changelog: {element.changelog}</p>
               <p>Url: {element.url}</p>
               <p>Version: {element.version}</p>
            </div>
        )
     }) } </div>
    </div>
  )
}

export default Get
