import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../Axios/axios';
import UserContext from '../../Context/userContext';
import "./ReviewForm.css";
const ReviewForm = () => {
    const navigate = useNavigate();
    const context = useContext(UserContext);
    let { showAlert, projectData, setPaymentSuccess } = context;
    const [credentials, setCredentials] = useState({ ideaRating: 0, approachRating: 0, websiteRating: 0, instagramRating: 0 })
    const [active, setActive] = useState("");
    const onChange = (e) => {
        e.preventDefault();
        setActive("button_active");
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { ideaRating, approachRating, websiteRating, instagramRating } = credentials;
        let overallRating = (parseInt(ideaRating) + parseInt(approachRating) + parseInt(websiteRating) + parseInt(instagramRating)) / 4;
        const response = await axios.post('/api/investor/review', {
            Project_id: projectData._id, ideaRating, approachRating, websiteRating, instagramRating, overallRating
        }, {
            headers: {
                "Content-Type": "application/json",
                "auth-token":
                    localStorage.getItem('token'),
            },
        }).catch((error) => {
            showAlert(error.response.data.msg);
        });
        if (response.data.success) {
            showAlert(response.data.msg, "success");
        }
        setCredentials({ ideaRating: 0, approachRating: 0, websiteRating: 0, instagramRating: 0 });
        setPaymentSuccess(false);
        navigate("/dashboard");
    }
    return (
        <>
            <div className="card mb-3 mx-auto my-5 project_form">
                <div className="row g-0">
                    <div className="col-md-5 col-sm-12">
                        <img src="https://www.pcg-services.com/wp-content/uploads/2016/08/project-business-strategy-1.jpg" className="img-fluid rounded-start review_image" alt="project-image" />
                    </div>
                    <div className="col-md-7 col-sm-12">
                        <div className="card-body">
                            <h5 className="card-title text-center">Project Rating Form</h5>
                            <form className="my-4">
                                <label for="exampleInputPassword1" className="form-label text-muted mb-3">What would you like to rate:</label>
                                <div className="mb-3">
                                    <label for="exampleInputPassword1" className="form-label text-muted">Their idea and vision?</label>
                                    <select name="ideaRating" className="form-select rating_btn" onChange={onChange} aria-label="Default select example">
                                        <option selected>Open this select menu</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label for="exampleInputPassword1" className="form-label text-muted">Their approach of solving the problem?</label>
                                    <select name="approachRating" className="form-select rating_btn" onChange={onChange} aria-label="Default select example">
                                        <option selected>Open this select menu</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label for="exampleInputPassword1" className="form-label text-muted">Their website?</label>
                                    <select name="websiteRating" className="form-select rating_btn" onChange={onChange} aria-label="Default select example">
                                        <option selected>Open this select menu</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label for="exampleInputPassword1" className="form-label text-muted">Their Instagram page?</label>
                                    <select name="instagramRating" className="form-select rating_btn" onChange={onChange} aria-label="Default select example">
                                        <option selected>Open this select menu</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                    </select>
                                </div>
                                <button className="my-5 btn form_submit_btn" onClick={handleSubmit}>Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReviewForm;