// CustomModal.jsx
import React, { useEffect, useState } from "react";
import "./assets/modalStyles.css";

const CustomModal = ({ modalType, onClose, onSubmit, response }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
    month: "",
    year: "",
    date: "",
  });

  const [inputValue, setInputValue] = useState(""); // For generalized input (ID fields)

  // Input handlers
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleGeneralInputChange = (e) => setInputValue(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    switch (modalType) {
      case "addProduct": {
        const processedData = {
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
          categoryId: parseInt(formData.categoryId, 10),
        };
        onSubmit(processedData);
        break;
      }
      case "deleteProduct": {
        onSubmit({ productId: parseInt(inputValue, 10) });
        break;
      }
      case "viewUser": {
        onSubmit({ userId: parseInt(inputValue, 10) });
        break;
      }
      case "modifyUser": {
        const formDataRaw = new FormData(e.target);
        const username = formDataRaw.get("username");
        const email = formDataRaw.get("email");
        const role = formDataRaw.get("role");
        const userId = parseInt(formDataRaw.get("userId"), 10);

        onSubmit({ userId, username, email, role });
        break;
      }
      case "monthlyBusiness":
        onSubmit({ month: formData.month, year: formData.year });
        break;
      case "dailyBusiness":
        onSubmit({ date: formData.date });
        break;
      case "yearlyBusiness":
        onSubmit({ year: formData.year });
        break;
      case "overallBusiness":
        onSubmit();
        break;
      default:
        break;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Add Product */}
        {modalType === "addProduct" &&
          (!response ? (
            <>
              <h2>Add Product</h2>
              <form className="modal-form" onSubmit={handleSubmit}>
                {["name", "price", "stock", "categoryId", "imageUrl"].map((field) => (
                  <div className="modal-form-item" key={field}>
                    <label htmlFor={field}>{field[0].toUpperCase() + field.slice(1)}:</label>
                    <input
                      type={field === "price" || field === "stock" || field === "categoryId" ? "number" : "text"}
                      id={field}
                      name={field}
                      placeholder={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                ))}
                <div className="modal-form-item">
                  <label htmlFor="description">Description:</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <button type="submit">Submit</button>
                <button type="button" onClick={onClose}>Cancel</button>
              </form>
            </>
          ) : (
            <div className="product-details-preview">
              <h2>Product Details</h2>
              {response.product ? (
                <div className="full-products">
                  <div className="product-details img">
                    <img
                      src={response.product.productImage?.imageUrl}
                      alt={response.product.name || "Product Preview."}
                    />
                  </div>
                  <div className="product-details-info">
                    {["name", "description", "price", "stock"].map((field) => (
                      <div className="product-details" key={field}>
                        <div>{field[0].toUpperCase() + field.slice(1)} :</div>
                        <div>{response.product[field]}</div>
                      </div>
                    ))}
                    <div className="product-details">
                      <div>Category :</div>
                      <div>{response.product.category?.categoryName}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No product details found.</p>
              )}
              <button onClick={onClose}>Close</button>
            </div>
          ))}

        {/* Delete Product */}
        {modalType === "deleteProduct" && (
          <>
            {!response ? (
              <form onSubmit={handleSubmit}>
                <h2>Delete Product</h2>
                <input
                  type="number"
                  placeholder="Enter Product ID"npm run dev
                  value={inputValue}
                  onChange={handleGeneralInputChange}
                  required
                />
                <button type="submit">Delete</button>
                <button type="button" onClick={onClose}>Cancel</button>
              </form>
            ) : (
              <div>
                <h2>{response.message}</h2>
                <button onClick={onClose}>Close</button>
              </div>
            )}
          </>
        )}

        {/* View User */}
        {modalType === "viewUser" && (
          <>
            {!response ? (
              <form onSubmit={handleSubmit}>
                <h2>View User Details</h2>
                <input
                  type="number"
                  placeholder="Enter User ID"
                  value={inputValue}
                  onChange={handleGeneralInputChange}
                  required
                />
                <button type="submit">Submit</button>
                <button type="button" onClick={onClose}>Cancel</button>
              </form>
            ) : (
              <div>
                {response.user ? (
                  <div className="user-details">
                    <h2>User Details</h2>
                    {["userId", "username", "email", "role"].map((field) => (
                      <p key={field}>
                        <strong>{field[0].toUpperCase() + field.slice(1)}:</strong> {response.user[field]}
                      </p>
                    ))}
                    <p>
                      <strong>Created At:</strong> {new Date(response.user.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Updated At:</strong> {new Date(response.user.updatedAt).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <h2>User Not Found</h2>
                )}
                <button onClick={onClose}>Back to Dashboard</button>
              </div>
            )}
          </>
        )}

        {/* Modify User */}
        {modalType === "modifyUser" && <ModifyUserFormComponent onClose={onClose} />}

        {/* Business Modals */}
        {["monthlyBusiness", "dailyBusiness", "yearlyBusiness", "overallBusiness"].includes(modalType) && (
          <BusinessModal
            modalType={modalType}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            response={response}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default CustomModal;

// ModifyUserFormComponent
const ModifyUserFormComponent = ({ onClose }) => {
  const [userId, setUserId] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [updated, setUpdated] = useState(false);

  const fetchUser = async (e) => {
    e.preventDefault();
    if (!userId) return;
    try {
      const response = await fetch("http://localhost:9090/admin/user/getbyid", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: parseInt(userId, 10) }),
      });
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data);
      } else {
        setUserDetails(null);
      }
    } catch (error) {
      console.error("Error fetching user", error);
      setUserDetails(null);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    if (!userDetails) return;
    const formData = new FormData(e.target);
    const updatedUser = {
      userId: parseInt(userId, 10),
      username: formData.get("username"),
      email: formData.get("email"),
      role: formData.get("role"),
    };
    try {
      const response = await fetch("http://localhost:9090/admin/user/modify", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data);
        setUpdated(true);
      }
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  if (!userDetails) {
    return (
      <form onSubmit={fetchUser}>
        <h2>Modify User</h2>
        <div className="modal-form-item">
          <label htmlFor="user-id">User ID:</label>
          <input
            type="number"
            id="user-id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Get User</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    );
  }

  if (userDetails && !updated) {
    return (
      <form onSubmit={updateUser} className="modal-form">
        <h2>Modify User</h2>
        <div className="modal-form-item">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" defaultValue={userDetails.username} required />
        </div>
        <div className="modal-form-item">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" defaultValue={userDetails.email} required />
        </div>
        <div className="modal-form-item">
          <label htmlFor="role">Role:</label>
          <input type="text" id="role" name="role" defaultValue={userDetails.role} required />
        </div>
        <button type="submit">Update</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    );
  }

  return (
    <div>
      <h2>Updated User Details</h2>
      <div className="user-details">
        {["userId", "username", "email", "role"].map((field) => (
          <p key={field}>
            <strong>{field[0].toUpperCase() + field.slice(1)}:</strong> {userDetails[field]}
          </p>
        ))}
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

// BusinessModal Component
const BusinessModal = ({ modalType, formData, handleInputChange, handleSubmit, response, onClose }) => {
  const businessKeyMap = {
    monthlyBusiness: ["month", "year"],
    dailyBusiness: ["date"],
    yearlyBusiness: ["year"],
    overallBusiness: [],
  };

  const titleMap = {
    monthlyBusiness: "Monthly Business",
    dailyBusiness: "Daily Business",
    yearlyBusiness: "Yearly Business",
    overallBusiness: "Overall Business",
  };

  const keys = businessKeyMap[modalType];

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <h2>{titleMap[modalType]}</h2>
      {!response && keys.map((key) => (
        <div className="modal-form-item" key={key}>
          <label htmlFor={key}>{key[0].toUpperCase() + key.slice(1)}:</label>
          <input
            type={key === "date" ? "text" : "number"}
            id={key}
            name={key}
            value={formData[key]}
            onChange={handleInputChange}
            placeholder={key === "date" ? "YYYY-MM-DD" : ""}
            required
          />
        </div>
      ))}
      {!response && <button type="submit">{modalType === "overallBusiness" ? "Get Overall Business" : "Submit"}</button>}

      {response && (
        <div>
          <div className="business-response-item">
            <div>Total Business: ₹</div>
            <div>{response[modalType]?.totalBusiness?.toFixed(2)}</div>
          </div>
          <div className="business-response-item"><h5>Category Sales</h5></div>
          {response[modalType]?.categorySales &&
            Object.keys(response[modalType].categorySales).map((key) => (
              <div key={key} className="business-response-item">
                <div>{key}</div>
                <div>{response[modalType].categorySales[key]}</div>
              </div>
            ))}
        </div>
      )}
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};
