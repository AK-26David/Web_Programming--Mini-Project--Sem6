import React from "react";
import Navbar from "./Navbar";
import { resource } from "./resource";
import "./Resources.css";

const Resources = () => {
  const resourceCopy = [...resource];

  const resourceList = resourceCopy.map((el) => (
    <div className="col-lg-4 col-md-6 col-sm-12">
      <div className="card card__body" style={{ width: "100%" }}>
        <img src={el.img} className="card-img-top p-1 resource_card_img" alt="resource-image" />
        <div className="card-body ">
          <h5 className="card-title card__title">{el.title}</h5>
          <p className="card-text my-3 card__desc">{el.desc}</p>
          <a href={el.link} target="_blank" className="btn my-3 butn">
            Read More
          </a>
        </div>
      </div>
    </div>
  ));
  return (
    <>
      <Navbar />
      <div className="resource_container">
        <div className="container my-5">
          <h1 className="text-center top__heading">
            Comparing The Top Online Fundraising And Crowdfunding Platforms
          </h1>
        </div>
        <div className="container-fluid">
          <table className="table table-bordered my-5 resource__table">
            <thead>
              <tr>
                <th scope="col" className="text-center heading">
                  Site
                </th>
                <th scope="col" className="text-center heading">
                  Total Raised
                </th>
                <th scope="col" className="text-center heading">
                  Supporters
                </th>
                <th scope="col" className="text-center heading">
                  Platform Fee
                </th>
                <th scope="col" className="text-center heading">
                  Payment Fee
                </th>
                <th scope="col" className="text-center heading">
                  Important To Know
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td scope="row" className="table__head">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/GoFundMe_Logo.svg/1200px-GoFundMe_Logo.svg.png"
                    alt="GoFundMe Logo"
                    className="website__logo"
                  />
                </td>
                <td className="text-center">$30B</td>
                <td className="text-center">150M</td>
                <td className="text-center">0%</td>
                <td className="text-center">2.9% + $0.30</td>
                <td>
                  <i className="fa-solid fa-check right__icon"></i>Primarily used for personal causes, emergencies, and medical expenses.{" "}
                  <br />
                  <i className="fa-solid fa-check right__icon"></i> No fees to start or manage a fundraiser.
                  <br />
                  <i className="fa-solid fa-check right__icon"></i> Donors can leave optional tips to support the platform. <br />
                  <i className="fa-solid fa-check right__icon"></i> The GoFundMe
                  Guarantee - in the very rare case that something isn’t right
                  with a fundraiser, donors may be eligible for a 100% refund of
                  their donation
                </td>
              </tr>
              <tr>
                <td scope="row" className="table__head">
                  <img
                    src="data:image/png;base64,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"
                    alt="Kickstarter Logo"
                    className="website__logo"
                  />
                </td>
                <td className="text-center">$7B</td>
                <td className="text-center">20M</td>
                <td className="text-center">5%</td>
                <td className="text-center">3.0% - 5.0%</td>
                <td>
                  <i className="fa-solid fa-xmark cross__icon"></i> All-or-nothing funding model: funds are collected only if the goal is met. <br />
                  <i className="fa-solid fa-check right__icon"></i> Focused on creative projects like art, music, and technology. <br />
                  <i className="fa-solid fa-check right__icon"></i> Backers receive rewards based on their pledge levels.
                </td>
              </tr>
              <tr>
                <td scope="row" className="table__head">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATMAAACkCAMAAADMkjkjAAAAkFBMVEX////sEHjrAG/rAHHsAHTqAGv5ydnye6j+9vrxcqTsGnr6zuH4vNL4u9T2ocPrAG70k7n0jbf+7/fwbqHygK/82+rxY5784u70j7nycqf6xdv95/HqAGn2qsjuQ43+8vjtM4PuR470l7zwZZ7zh7T2r8vsKYH1osP83evvVpX3tNDygqvtOojvWpj4vNj71ebjkWOQAAAJhklEQVR4nO2daXeqOhRAhYSqKOJYK85DnarP///vnmE4OYFQPdV7r13r7G9gCGGTOWmpVBiGYRiGIVMPxUsyaf5rM+VUpfOSuOyMDDujw87osDM67IwOO6PzO5zJl+B3OevVX4CD/E3O/H+dkpgo/FXOav86KYrAZWdU2BkddkaHndFhZ3TYGR12Roed0WFndNgZHXZGh53RYWd02BkddkaHndFhZ3TYGR12Roed0WFndNgZHXZGh53RYWd02BkddkaHndFhZ3TYGR12Roed0WFndNgZHXZGh53RYWd02BkddkaHndFhZ3TYGR12Roed0WFndNgZHXZGh53RYWd02BkddkaHndFhZ3TYGR12Roed0WFndNgZHXZGh53RYWd02BkddkaHndFhZ3TYGR12Roed0WFndNgZHXZGh53RYWd02BkddkYn8NL/7x6ys3uJFrOERfSvk1LOizn7FbAzOuyMDjujc9NZrdNOOarDZts4jDkap4I2prU7vo2NqLtZhB8NdfjZttIZoEv206+ZL4SQzulrty8mdB6tzr68BnBO1enY+hjzxqq+dVQc/qF97BYDDKdfJ0fF4R9WTcvviJvOupP0q3thXR2u4ZuAE0hcLz0X9uIYPfNrfa4rtmvUcxhkEXobdXi2f2RQf+Ov1jq5bvZxGSlFuO0MjRTue04o9O/u7LMopK6CZGFEKJZTM8Bxhu4hQlkfFOKgOMu+UCJjZz39nZ5zFmQkcYi+cApIz4dEDrIIRUcdvts/lgR92kC6uRBSeGuUmape/vdwezGfoZ4Pcg3jtJDSUyEOr/4nnDne293OroTLHzmrerZfPZAy31pfEc5q84UtRfIEAY6hJQ1iYS/kjzmTW4ozRyx/4GwT2n4UH5C8hf3yMIAQta01iLvPAkTW13J9vLJW8QFnjtuiOHNEj+wsmtifBlK3LruZHH8fxAXt3bIvqYnDH3DmhHOKs7REUZzZs0jYyBIXWbNhnJastrXnIqR9VJ5enVmf50zUSc6S5yA4+7SXzCok7lT+tb1JWvaWN7QPS7XjKu95ztKcU+bMDRXoAq/7nbMQM1HvGGczGcd1PSF1Soeo6F57CCFuYWW1oEQFCeMuBdKOX7G8pljg9Oba36c4S95EiTPx3+VyaTRH+gp3+o2zUyPCXIv9UBcrse03g6DZX167dXrGY4OiXu6C4DjSHwlMPya30krcQysIgs/eIpToQ3OoTZPrYxBMDy6cEZs/4CyxUOYs7XpeINnyvdyZXBZu3YQLxXt2btw/6wAzSIybjkrGurQmmQQdQy+5MdPa9/Be5DZtNiKQJhd/wpkjazedVVrZmTgN9zuDtJWkfa6V7YrnhHqdNX24ssYx1bmqWzwnrH20R52pB7/lrAZ1iuxSnMGHJcNj4TeFziOOPtmBFzRSQXR1NrfGUYf30tcn4ZrQOoR61JnqG95ypgtIOCx3Npt3U7IxvQ8vxv68R0iartIrFzg5M47O1igq6yxpXkOfBCmiOHR9hjN5uO3sC5wN7mk3J2lKjSJ9ff4B5npiB3faofQaV71lxSwuqZWuEYUqePp1ouefQsTWAv2wMyeMqrecQeOlqurb/bO0ZexmzyvX6nAwwX0RDztz31CCIRr1RFCVJoOpNo5j8qUGVlloiaKIzCQ+35k83cxnOkNM73EWJjUvdK1kPOhqGJ1PiaMNcT8KSrSqwaB2S4reGd9MXu9fg9BbFMU4qyjtnY0fO/P1pJBjhLA4g4ZIFaLbzkRyFQRMquedMb5Qzta4yAOQc2JnUF3Fw4KFEQV2Jg1nkMO/nulMrJaFZ32WszT5F9NZ3+xNG872KMFQQ6lGumNWV2Zy/76zRmHwe4ez1h3OsiYul8/WVGdGPgtV72tsFu+/7uxDd59uOqPVZ1nPYWg62xac6foMl82S+kxVeZd7nUESn1qfXZ2N8xMYD7ab2VKAlzbwNfPOybqB3Zm1DTDazbgNaMZLEVB2O7jdxN86123AU9tNNVW6yUkrdVbFlXWZs+3qI6GTlTToacXt5qb98dFuW50JvLkDQqj5Axg7xn2NqHONvg1dI3V/KMkCRRFAEp/aP4unl32zXD02DiiOnaDcoHks7OxoezRdolWE0EER00KI2JmuE9HQcofLxZOdBUb9cM94c/yj8aaj04adwVyRfNcXQc4yx5tSryPtsTNdBNCkLNzYfep4M1nGMCdBy5wd4TEWlR/Na6C5P+xMT1qggQ9kHPfTCKLr+Mxq7EynTQ9I57rWfOq8RuJsr2dSyp3VdIAfzp8lFVocF2QtdQT5IRldKXQPyIufF6oFF+bMspIXO9Pzmi5kND3XYZ/cfsyZ2QzYnQW6k/DdPK2cdceYGn4e2MEHNU3sDHoSjlgnUx+fOuMnGasNF/jZ/FimMXaGurlpldet6+kza7P5qLMaLpz59YDtFV+gBYHv1wNcTG49IOw19uPhpW/0NSpjvR4gw1m9vnZ0BSuS+TA9gSb91WA43jcPYLGTe+uuc67Xlzi99h0IDzozmoGb607xgiFh3WmqI5euuR6TTEPg+lTtKEURTNKaQc9/O2oJBa2zJM6MXqYZhyxZ4HzUGV4uu7m+2SA6q1l/Su4V39yc68CIrIYL7KvkTuasUi1N7yRO73+FxaeHnaEJ5lvr6EmPgLIm/Fn+wMnd627Jz3oqe2a/ATir+SUB4tXb+bnVzu0hetwZek839mvMKmRnlV6JE5giPNjvhkZTpXsLUme5UWguvdNN9TB6urP5fc5+uC/ovaT0wbTqwRJAumhyv3KR9ltkziqRsARwl7GQ1mq5zg+gHnemdwikzooJkA/sP1sV9o6ZziqrMPfI0juYXdHu0hoHOLsWwFwAKcJU1LTfqvcrJoR9jnHHMtvnOEGzJKf0nBeHGOX3OYbyNEK7/WGf4+S+fY5oj6KU8LuHUtjZogChPONMlhAthZsEkToOD02ORe/SRXFsN1lnrjaKPvKLT7f3IK9aKcnupuwItSb77FxsptHC7D6jobk7tbsyoohaVlYoq9Si1fm09f3t7L29ywIYcQ5a/eXiGuB0bkf2vbDD6WZ58n3/tKzCPfDKS2UerM4zdZNrANxS1vbDXFS8b/sHsDM67IwOO6PzYs6a/iLB57+ru5cg5L/fpMJ/J0yHndFhZ3TYGR12Roed0YHlhd/hLGq8AHo3zG9w5nivgP67n1/h7LVgZ3TYGR12Roed0WFndNgZnVd2Vvfcl2Tyws72by/K9/+yh2EYhmH+Jv8D2DXoSnln+AEAAAAASUVORK5CYII="
                    alt="Indiegogo Logo"
                    className="website__logo"
                  />
                </td>
                <td className="text-center">$2B</td>
                <td className="text-center">10M</td>
                <td className="text-center">5%</td>
                <td className="text-center">2.9% + $0.30</td>
                <td>
                  <i className="fa-solid fa-check right__icon"></i> Offers both flexible and fixed funding options. <br />
                  <i className="fa-solid fa-xmark cross__icon"></i> InDemand feature allows continued fundraising after the campaign ends. <br />
                  <i className="fa-solid fa-check right__icon"></i> Supports a wide range of projects, including tech and community initiatives. <br />
                </td>
              </tr>
              <tr>
                <td scope="row" className="table__head">
                  <img
                    src="data:image/png;base64,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"
                    alt="Patreon Logo"
                    className="website__logo"
                  />
                </td>
                <td className="text-center">$3.5B</td>
                <td className="text-center">8M</td>
                <td className="text-center">5.0% - 12.0%</td>
                <td className="text-center">5.0%</td>
                <td>
                  <i className="fa-solid fa-check right__icon"></i> Subscription-based model for ongoing creator support. <br />
                  <i className="fa-solid fa-check right__icon"></i> Popular among artists, podcasters, and educators. <br />
                  <i className="fa-solid fa-xmark cross__icon"></i> Apple charges a 30% fee for subscriptions made through iOS apps.
                </td>
              </tr>
              <tr>
                <td scope="row" className="table__head">
                  <img
                    src="data:image/png;base64,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"
                    alt="FundRazr logo"
                    className="website__logo"
                  />
                </td>
                <td className="text-center">200M</td>
                <td className="text-center">N/A</td>
                <td className="text-center">0.0% - 5.0%</td>
                <td className="text-center">2.9% + $0.30</td>
                <td>
                  <i className="fa-solid fa-check right__icon"></i> Supports both "Keep it All" and "All or Nothing" funding models. <br />
                  <i className="fa-solid fa-check right__icon"></i> Offers customizable donation forms and campaign pages. <br />
                  <i className="fa-solid fa-check right__icon"></i> Suitable for nonprofits, personal causes, and business ventures.​ <br />
                </td>
              </tr>
              <tr>
                <td scope="row" className="table__head">
                  <img
                    src="data:image/png;base64,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"
                    alt="SeedInvest Logo"
                    className="website__logo"
                  />
                </td>
                <td className="text-center">$300M</td>
                <td className="text-center">600,000</td>
                <td className="text-center">7.5%</td>
                <td className="text-center">2.0%</td>
                <td>
                  <i className="fa-solid fa-check right__icon"></i> Equity crowdfunding platform for startups. <br />
                  <i className="fa-solid fa-xmark cross__icon"></i> Investors receive equity in exchange for funding. <br />
                  <i className="fa-solid fa-check right__icon"></i> Strict vetting process for startups seeking funding <br />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="container my-5 card__container">
          <h1 className="text-center top__heading1 my-3">
            Know more about the Crowdfunding Ecosystem
          </h1>
          <div className="row gy-3">{resourceList}</div>
        </div>
      </div>
    </>
  );
};

export default Resources;
