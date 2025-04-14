import React, { useContext, useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { useNavigate } from "react-router-dom";
import UserContext from '../../Context/userContext';
import "./Dashboard.css";
import DashboardCard from './dashboardCard';
import DashboardNavbar from './DashboardNavbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  let { getUserData, startups, getStartups } = context;
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Space")
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate("/login");
    }
    getUserData();
    getStartups();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [])

  const resourceCopy = [...startups];
  const FilteredList = resourceCopy.filter((element) => {
    return element.Category === category;
  });
  const resourceList = FilteredList.map((el) => (
    <DashboardCard key={el._id} el={el}></DashboardCard>
  ))
  return (
    <>
      {loading ? (<ReactLoading type={"cylon"} color={"rgb(225, 41, 246)"} height={'50%'} width={'100%'} />) : (<>
        <DashboardNavbar />
        <div className="scrollmenu">
          <h5 onClick={() => { setCategory("Space") }}>Space</h5>
          <h5 onClick={() => { setCategory("Automobile") }}>Automobile</h5>
          <h5 onClick={() => { setCategory("Aircraft") }}>Aircraft</h5>
          <h5 onClick={() => { setCategory("Hyperloop") }}>Hyperloop</h5>
          <h5 onClick={() => { setCategory("Software") }}>Software</h5>
          <h5 onClick={() => { setCategory("Robotics") }}>Robotics</h5>
          <h5 onClick={() => { setCategory("Bio-Tech") }}>Bio-Tech</h5>
          <h5 onClick={() => { setCategory("Defense") }}>Defense</h5>
          <h5 onClick={() => { setCategory("Welfare") }}>Welfare</h5>
        </div>
        <div className="container-fluid dashboard__container">

          <div className="container my-5">
            <div className="row gy-3">
              {(FilteredList.length === 0) && <> <h2 className="text-center my-5" style={{ color: "rgb(225, 41, 246)" }}>No projects of this category have been added here yet...</h2></>}
              {resourceList}
            </div>
          </div>
        </div>
      </>)}
    </>
  )
}

export default Dashboard;