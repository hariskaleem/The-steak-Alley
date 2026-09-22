import React from "react";

const Chefs = () => {
  const Chef = [
    { id: 1, name: "Marcel Fulton", designation: "Chef", image: "/images/chef1.jpg" },
    { id: 2, name: "Anabella Smith", designation: "Chef", image: "/images/chef5.jpg" },
    { id: 3, name: "Jon Snow", designation: "Chef", image: "/images/chef3.jpg" },
    { id: 4, name: "Arya Stark", designation: "Assistant Chef", image: "/images/chef2.jpg" },
    { id: 5, name: "Mitchel Williams", designation: "Chef", image: "/images/chef4.jpg" },
    { id: 6, name: "Robert Bratheon", designation: "Chef", image: "/images/chef6.jpg" },
  ];

  const groups = [
    [1, 2, 3],
    [4, 5, 6],
  ];

  return (
    <div>
      <div className="container mt-4">
        <div className="row mt-4">
          <h1 className="text-center text-white mb-4">Meet Our Chefs</h1>
          <p
            className="text-center"
            style={{ marginBottom: "40px", color: "#bd9f67" }} // ↓ reduced bottom space
          >
            Meet the skilled people behind every perfectly prepared plate.
            <br /> Our chefs bring experience, creativity, and care to The Steak Alley kitchen.
          </p>
        </div>
      </div>

      {groups.map((group, index) => (
        <React.Fragment key={index}>
          <div
            className="cards-row"
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}>
            {Chef.filter((item) => group.includes(item.id)).map((item) => (
              <div className="chefcard2" key={item.id}>
                {" "}
                {/* ↓ removed extra container class */}
                <div className="border" />
                <div className="content">
                  <div className="image_container1">
                    <img src={item.image} alt={item.name} className="image2" />
                  </div>

                  <div className="title2">
                    <h3 style={{ color: "#bd9f67" }}>{item.name}</h3>
                  </div>

                  <div className="action2">
                    <div className="designation1 text-center">
                      <p>{item.designation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Chefs;
