import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../Axios/axios";
import UserContext from "../../Context/userContext";
import DashboardNavbar from "./DashboardNavbar";
import "./Product.css";
import ProductCard from "./ProductCard";
const Product = () => {
  const param = useParams();
  const context = useContext(UserContext);
  const { setProjectData, loadRazorpay, projectData } = context;
  const navigate = useNavigate();

  useEffect(() => {
    // getUserData();
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    const fetchProjectsData = async () => {
      try {
        const response = await axios.post(
          `/api/investor/fetch-project`,
          { project_id: param.id },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setProjectData(response.data.data);
        }
      } catch (error) {
        console.log(error);
        navigate("*");
      }
    };
    fetchProjectsData();
  }, [param.id]);

  return (
    <>
      <DashboardNavbar />
      {projectData && (
        <>
          <ProductCard data={projectData}></ProductCard>
        </>
      )}
    </>
  );
};

export default Product;
