import React from "react";
import serviceData from "../../data/bi/cards-section.json"; // Adjust the alias if needed
import SectionTitle from '../../components/containers/SectionTitle';
import CardIcon from '../../components/containers/bi/CardIcon';
import { FaArrowRight } from 'react-icons/fa';

const BusinessCards = () => {
  return (
    <section className="tf__popular_services_2">
      <div className="container">
        <div className="row wow fadeInUp">
          <div className="col-xl-10 text-center mb-3 m-auto">
            {/* <div className="tf__heading_area">
              <h2>Empowering Smarter Decisions with BI-Driven ERP Solutions</h2>
            </div> */}
            {/* <SectionTitle  title="Empowering Smarter Decisions with BI-Driven ERP Solutions | Tech Cloud ERP" /> */}
            <SectionTitle  title="Business Intelligence for Smarter ERP Decisions" />

          </div>
        </div>
        <div className="row">
          {serviceData.map((service, index) => (
            <div className="col-xl-4 col-md-6 col-lg-4 wow fadeInUp" key={index}>
              <div className="tf__single_services">
                <span>
                  <CardIcon iconName={service.icon} />
                </span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a href="#">
                  <FaArrowRight size={20} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessCards;
