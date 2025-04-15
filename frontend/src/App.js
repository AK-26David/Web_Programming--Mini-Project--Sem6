import React, { useContext, useEffect } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";
import "./App.css";
import UserContext from "./Context/userContext";
import Alert from "./components/Alert/Alert";
import Dashboard from "./components/Dashboard/Dashboard";
import Product from "./components/Dashboard/Product";
import Investment from "./components/Dashboard/investments/Investment";
import Profile from "./components/Dashboard/profile/Profile";
import ViewReview from "./components/Dashboard/viewReview/ViewReview";
import YourProjects from "./components/Dashboard/your-projects/YourProjects";
import Form from "./components/Forms/Form";
import ReviewForm from "./components/Forms/ReviewForm";
import HomePage from "./components/Landing Pages/HomePage";
import Registered from "./components/Landing Pages/Project/Registered";
import Resources from "./components/Landing Pages/Resources";
import Vision from "./components/Landing Pages/Vision";
import WhatWeDo from "./components/Landing Pages/WhatWeDo";
import Login from "./components/Login/Login";
import Signup from "./components/Login/Signup";
import Error from "./components/failed/Error";
function App() {
  const context = useContext(UserContext);
  let { alert,getUserData } = context;
  useEffect(() => {
    if (localStorage.getItem('token')) {
      getUserData();
    }
    return ()=>{
      getUserData();
    }
  }, [])

  return (
    <>
      <Router>
        <>

          {alert && <Alert></Alert>}
          <Routes>
            <Route exact path="/" element={<HomePage />}>
            </Route>

            <Route exact path="/vision" element={<Vision />}>
            </Route>

            <Route exact path="/whatwedo" element={<WhatWeDo />}>
            </Route>

            <Route exact path="/howwedoit" element={<Registered />}>
            </Route>

            <Route exact path="/resources" element={<Resources />}>
            </Route>

            <Route exact path="/signup" element={<Signup />}>
            </Route>

            <Route exact path="/login" element={<Login />}>
            </Route>

            <Route exact path="/dashboard" element={<Dashboard />}></Route>

            <Route exact path="/dashboard/project/:id" element={<Product></Product>}></Route>

            <Route exact path="/dashboard/project/:id/viewReview" element={<ViewReview></ViewReview>}></Route>

            <Route exact path="/dashboard/create-project" element={<Form></Form>}></Route>

            <Route exact path="/dashboard/profile" element={<Profile></Profile>}></Route>

            <Route exact path="/dashboard/project/review" element={<ReviewForm></ReviewForm>}></Route>

            <Route exact path="/dashboard/yourProject" element={<YourProjects></YourProjects>}></Route>

            <Route exact path="/dashboard/investments" element={<Investment></Investment>}></Route>

            <Route exact path="*" element={<Error></Error>} />
          </Routes>
        </>


      </Router>
    </>
  );
}

export default App;