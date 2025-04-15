import { useEffect, useState } from "react";
import axios from "../Axios/axios";
import UserContext from "./userContext";
const UserState = (props) => {
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderAmount, setOrderAmount] = useState(0);
  const [userProject, setUserProject] = useState([]);
  const [investmentData, setInvestmentData] = useState([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  let showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };
  useEffect(() => {
    getUserProjects();
    getUserData();
  }, []);

  // payment Gateway
  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => {
      showAlert("Razorpay SDK failed to load. Are you online?");
    };
    script.onload = async () => {
      try {
        setLoading(true);
        const result = await axios.post(
          "/api/investor/create-order",
          {
            amount: orderAmount * 100,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
          }
        );
        const { amount, id: order_id, currency } = result.data.order;
        const {
          data: { key: razorpayKey },
        } = await axios.get("/api/investor/get-razorpay-key", {
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        });

        const options = {
          key: razorpayKey,
          amount: amount.toString(),
          currency: currency,
          name: "example name",
          description: "example transaction",
          order_id: order_id,
          handler: async function (response) {
            const result = await axios.post(
              "/api/investor/pay-order",
              {
                amount: amount / 100,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                investor_id: user._id,
                project_id: projectData._id,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  "auth-token": localStorage.getItem("token"),
                },
              }
            );
            if (result.data.success) {
              showAlert(result.data.msg, "success");
              setPaymentSuccess(true);
            }
          },
          prefill: {
            name: "example name",
            email: "email@example.com",
            contact: "111111",
          },
          notes: {
            address: "example address",
          },
          theme: {
            color: "#80c0f0",
          },
        };
        setLoading(false);
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        showAlert(err);
        setLoading(false);
      }
    };
    document.body.appendChild(script);
  };

  const getInvestmentData = async () => {
    const response = await axios
      .get("/api/investor/getTransactions", {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      })
      .catch((error) => {
        console.log(error.response.data.msg);
      });
    if (response.data.success) {
      setInvestmentData(response.data.data);
    }
  };

  const getUserData = async () => {
    try {
      const response = await axios.get(`/api/auth/getuser`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      setUser(response.data.data);
    } catch (error) {
      // Handle errors, e.g., clear user state if unauthorized
      console.error("Error fetching user data:", error.response ? error.response.data : error.message);
      setUser(null); // Clear user data on error
    }
  };
  const getProjects = async () => {
    const response = await axios.get(`/api/investor/fetch-projects`, {
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    if (response.data.success) {
      setProjects(response.data.data);
    }
  };
  // for Projects DashBoard
  const getUserProjects = async () => {
    try {
      const response = await axios.get(`/api/investor/fetchuserProjects`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      if (response.data.success) {
        setUserProject(response.data.data);
      }
    } catch (error) {
      // Handle errors, e.g., clear projects if unauthorized
      console.error("Error fetching user projects:", error.response ? error.response.data : error.message);
      setUserProject([]); // Clear user projects on error
    }
  };
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        getUserData,
        alert,
        showAlert,
        setProjects,
        projects,
        getProjects,
        setProjectData,
        projectData,
        loadRazorpay,
        setOrderAmount,
        orderAmount,
        getUserProjects,
        userProject,
        getInvestmentData,
        investmentData,
        paymentSuccess,
        setPaymentSuccess,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
export default UserState;
