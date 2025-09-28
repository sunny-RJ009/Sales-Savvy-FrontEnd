// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "./Footer";
import Logo from "./Logo";
import "./assets/styles.css";
import CustomModal from "./CustomModal";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null); // State to manage modal visibility and type
  const [modalData, setModalData] = useState(null); // State to store data passed to modal (if needed)
  const [response, setResponse] = useState(null);   // State to store API responses
  const [inputValue, setInputValue] = useState("");

  // Reset delete modal state whenever it opens
  useEffect(() => {
    if (modalType === "deleteProduct") {
      setResponse(null);
      setInputValue("");
    }
  }, [modalType]);

  // Centralized card data
  const cardData = [
    {
      title: "Add Product",
      description: "Create and manage new product listings with validation",
      team: "Product Management",
      modalType: "addProduct",
    },
    {
      title: "Delete Product",
      description: "Remove products from inventory system",
      team: "Product Management",
      modalType: "deleteProduct",
    },
    {
      title: "Modify User",
      description: "Update user details and manage roles",
      team: "User Management",
      modalType: "modifyUser",
    },
    {
      title: "View User Details",
      description: "Fetch and display details of a specific user",
      team: "User Management",
      modalType: "viewUser",
    },
    {
      title: "Monthly Business",
      description: "View revenue metrics for specific months",
      team: "Analytics",
      modalType: "monthlyBusiness",
    },
    {
      title: "Day Business",
      description: "Track daily revenue and transactions",
      team: "Analytics",
      modalType: "dailyBusiness",
    },
    {
      title: "Yearly Business",
      description: "Analyze annual revenue performance",
      team: "Analytics",
      modalType: "yearlyBusiness",
    },
    {
      title: "Overall Business",
      description: "View total revenue since inception",
      team: "Analytics",
      modalType: "overallBusiness",
    },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:9090/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        console.log("User successfully logged out");
        navigate("/admin");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // === API Handlers ===
  const handleAddProductSubmit = async (productData) => {
    try {
      const response = await fetch("http://localhost:9090/admin/products/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      console.log("Product added response:", data);
      setResponse({ product: data });
      setModalType("addProduct");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDeleteProductSubmit = async ({ productId }) => {
    try {
      const res = await fetch("http://localhost:9090/admin/products/delete", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const text = await res.text();
      if (res.ok) {
        setResponse({
          success: true,
          message: text || `Product ${productId} deleted successfully`,
        });
      } else {
        setResponse({
          success: false,
          message: text || "Product not found",
        });
      }
    } catch (err) {
      setResponse({ success: false, message: `Network error: ${err.message}` });
    }
  };

  const handleViewUserSubmit = async ({ userId }) => {
    try {
      const res = await fetch("http://localhost:9090/admin/user/getbyid", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse({ success: true, user: data });
      } else {
        const text = await res.text();
        setResponse({ success: false, message: text || "User not found" });
      }
    } catch (err) {
      setResponse({ success: false, message: `Network error: ${err.message}` });
    }
  };

  const handleModifyUserSubmit = async (data) => {
  const baseUrl = "http://localhost:9090/admin/user";

  // ---------- 1️⃣ Fetch existing user ----------
  if (!data.username) {
    try {
      console.log("Fetching user details for ID:", data.userId);

      const res = await fetch(`${baseUrl}/getbyid`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: data.userId }),
      });

      if (!res.ok) {
        // ✅ Explicit handling for 404
        if (res.status === 404) {
          setResponse({ message: "User not found. Please check the ID." });
        } else {
          const errText = await res.text();
          setResponse({ message: `Error ${res.status}: ${errText || "Unknown"}` });
        }
        setModalType("response");
        return;
      }

      const userDetails = await res.json();
      setResponse({ user: userDetails });
      setModalType("modifyUser"); // show form for editing

    } catch (err) {
      console.error("Network error while fetching user:", err);
      setResponse({ message: "Network error. Try again later." });
      setModalType("response");
    }
    return;
  }

  // ---------- 2️⃣ Update user details ----------
  try {
    console.log("Updating user details:", data);

    const res = await fetch(`${baseUrl}/modify`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errText = await res.text();
      setResponse({ message: `Error ${res.status}: ${errText || "Update failed"}` });
      setModalType("response");
      return;
    }

    const updatedUser = await res.json();
    setResponse({ user: updatedUser, message: "User updated successfully!" });
    setModalType("response");

  } catch (err) {
    console.error("Network error while updating user:", err);
    setResponse({ message: "Network error. Try again later." });
    setModalType("response");
  }
};


  const handleMonthlyBusiness = async (data) => {
    try {
      const response = await fetch(
        `http://localhost:9090/admin/business/monthly?month=${data?.month}&year=${data?.year}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        const resData = await response.json();
        setResponse({ monthlyBusiness: resData });
        setModalType("monthlyBusiness");
      } else {
        const errorMessage = await response.text();
        setResponse({ message: `Error: ${errorMessage}` });
        setModalType("monthlyBusiness");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setResponse({ message: "Error: Something went wrong" });
      setModalType("response");
    }
  };

  const handleDailyBusiness = async (data) => {
    try {
      const response = await fetch(
        `http://localhost:9090/admin/business/daily?date=${data?.date}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        const resData = await response.json();
        setResponse({ dailyBusiness: resData });
        setModalType("dailyBusiness");
      } else {
        const errorMessage = await response.text();
        setResponse({ message: `Error: ${errorMessage}` });
        setModalType("dailyBusiness");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setResponse({ message: "Error: Something went wrong" });
      setModalType("dailyBusiness");
    }
  };

  const handleYearlyBusiness = async (data) => {
    try {
      const response = await fetch(
        `http://localhost:9090/admin/business/yearly?year=${data?.year}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        const resData = await response.json();
        setResponse({ yearlyBusiness: resData });
        setModalType("yearlyBusiness");
      } else {
        const errorMessage = await response.text();
        setResponse({ message: `Error: ${errorMessage}` });
        setModalType("yearlyBusiness");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setResponse({ message: "Error: Something went wrong" });
      setModalType("yearlyBusiness");
    }
  };

  const handleOverallBusiness = async () => {
    try {
      const response = await fetch(`http://localhost:9090/admin/business/overall`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const resData = await response.json();
        setResponse({ overallBusiness: resData });
        setModalType("overallBusiness");
      } else {
        const errorMessage = await response.text();
        setResponse({ message: `Error: ${errorMessage}` });
        setModalType("overallBusiness");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setResponse({ message: "Error: Something went wrong" });
      setModalType("overallBusiness");
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <Logo />
        <div className="user-info">
          <span className="username">Admin</span>
          <div className="dropdown">
            <button className="dropdown-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="cards-grid">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="card"
              onClick={() => {
                setModalType(card.modalType);
                setModalData(null);
              }}
            >
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
                <span className="card-team">Team: {card.team}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal */}
      {modalType && (
        <CustomModal
          modalType={modalType}
          onClose={() => {
            setModalType(null);
            setResponse(null);
          }}
          onSubmit={(data) => {
            switch (modalType) {
              case "addProduct":
                handleAddProductSubmit(data);
                break;
              case "deleteProduct":
                handleDeleteProductSubmit(data);
                break;
              case "viewUser":
                handleViewUserSubmit(data);
                break;
              case "modifyUser":
                handleModifyUserSubmit(data);
                break;
              case "monthlyBusiness":
                handleMonthlyBusiness(data);
                break;
              case "dailyBusiness":
                handleDailyBusiness(data);
                break;
              case "yearlyBusiness":
                handleYearlyBusiness(data);
                break;
              case "overallBusiness":
                handleOverallBusiness();
                break;
              default:
                break;
            }
          }}
          response={response}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
