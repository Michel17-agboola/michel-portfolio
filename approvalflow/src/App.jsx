import { useState } from "react";
import "./App.css";

/* =========================
   NEW REQUEST
========================= */

function NewRequest() {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [requestType, setRequestType] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestData = {
      "Employee Name": employeeName,
      "Employee Email": employeeEmail,
      "Department": department,
      "Request Type": requestType,
      "Request Description": description,
      "Start Date": startDate,
      "End Date": endDate,
    };

    try {
      const response = await fetch(
        "https://michel2.app.n8n.cloud/webhook-test/leave-request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const result = await response.json();
      console.log("n8n response:", result);
      alert("Request submitted successfully!");

      setEmployeeName("");
      setEmployeeEmail("");
      setDepartment("");
      setRequestType("");
      setDescription("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleCancel = () => {
    setEmployeeName("");
    setEmployeeEmail("");
    setDepartment("");
    setRequestType("");
    setDescription("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <section className="content request-page">
      <div className="page-heading request-heading">
        <div>
          <h1>New Request</h1>
          <p>
            Submit a request for approval. Your request will be
            routed to the appropriate approver.
          </p>
        </div>
      </div>

      <div className="request-card">
        <div className="request-card-header">
          <div className="request-card-icon">＋</div>
          <div>
            <h2>Request Details</h2>
            <p>Complete the information below to submit your request.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Employee Name */}
            <div className="form-group">
              <label>
                Employee Name <span>*</span>
              </label>
              <input
                type="text"
                value={employeeName}
                onChange={(event) => setEmployeeName(event.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Employee Email */}
            <div className="form-group">
              <label>
                Employee Email <span>*</span>
              </label>
              <input
                type="email"
                value={employeeEmail}
                onChange={(event) => setEmployeeEmail(event.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>

            {/* Department */}
            <div className="form-group">
              <label>
                Department <span>*</span>
              </label>
              <select
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                required
              >
                <option value="">Select department</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Operations">Operations</option>
                <option value="Procurement">Procurement</option>
              </select>
            </div>

            {/* Request Type */}
            <div className="form-group">
              <label>
                Request Type <span>*</span>
              </label>
              <select
                value={requestType}
                onChange={(event) => setRequestType(event.target.value)}
                required
              >
                <option value="">Select request type</option>
                <option value="Leave Request">Leave Request</option>
                <option value="Procurement Request">Procurement Request</option>
                <option value="Expense Request">Expense Request</option>
                <option value="IT Support Request">IT Support Request</option>
                <option value="Asset Request">Asset Request</option>
              </select>
            </div>

            {/* Description */}
            <div className="form-group full">
              <label>
                Request Description <span>*</span>
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe your request and provide any relevant details..."
                rows="5"
                required
              />
            </div>

            {/* Start Date */}
            <div className="form-group">
              <label>
                Start Date <span>*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                required
              />
            </div>

            {/* End Date */}
            <div className="form-group">
              <label>
                End Date <span>*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-divider"></div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

/* =========================
   DASHBOARD
========================= */

function Dashboard({ setPage }) {
  const [metrics, setMetrics] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    recent: [],
    typeCounts: {},
  });
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetch("https://michel2.app.n8n.cloud/webhook/dashboard-data")
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load dashboard data:", error);
        setLoading(false);
      });
  }, []);

  const statusClassFor = (status) => {
    if (status === "Approved") return "approved";
    if (status === "Rejected") return "rejected";
    return "review";
  };

  return (
    <section className="content">
      <div className="page-heading">
        <div>
          <h1>Employee Dashboard</h1>
          <p>Track your requests and their approval status.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setPage("new-request")}
        >
          ＋ New Request
        </button>
      </div>

      <div className="stats">
        <Stat title="Total Requests" value={metrics.total} icon="▣" />
        <Stat title="Pending" value={metrics.pending} icon="◷" />
        <Stat title="Approved" value={metrics.approved} icon="✓" />
        <Stat title="Rejected" value={metrics.rejected} icon="×" />
      </div>

      <div className="dashboard-grid">
        {/* Recent Requests */}
        <div className="card">
          <div className="card-header">
            <h2>Recent Requests</h2>
            <button onClick={() => setPage("requests")}>View all</button>
          </div>

          <div className="table">
            <div className="table-row table-head">
              <span>Request ID</span>
              <span>Employee</span>
              <span>Type</span>
              <span>Status</span>
            </div>

            {loading && <p style={{ padding: "12px 4px" }}>Loading...</p>}

            {!loading &&
              metrics.recent.map((row) => (
                <RequestRow
                  key={row["Request ID"]}
                  id={row["Request ID"]}
                  employee={row["Employee Name"]}
                  type={row["Request Type"]}
                  status={row["Status"]}
                  statusClass={statusClassFor(row["Status"])}
                />
              ))}
          </div>
        </div>

        {/* Requests by Type */}
        <div className="card">
          <div className="card-header">
            <h2>Requests by Type</h2>
          </div>

          <div className="type-list">
            {loading && <p style={{ padding: "12px 4px" }}>Loading...</p>}

            {!loading &&
              Object.entries(metrics.typeCounts || {}).map(
                ([name, count]) => (
                  <TypeItem key={name} name={name} count={count} />
                )
              )}

            {!loading &&
              Object.keys(metrics.typeCounts || {}).length === 0 && (
                <p style={{ padding: "12px 4px", color: "#8991a2" }}>
                  No requests yet.
                </p>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================
   MY REQUESTS
========================= */

function MyRequests({ searchTerm }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetch("https://michel2.app.n8n.cloud/webhook/dashboard-data")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data.allRequests || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load requests:", error);
        setLoading(false);
      });
  }, []);

  const statusClassFor = (status) => {
    if (status === "Approved") return "approved";
    if (status === "Rejected") return "rejected";
    return "review";
  };

  const query = (searchTerm || "").toLowerCase().trim();

  const filteredRequests = requests.filter((row) => {
    if (!query) return true;
    return (
      String(row["Request ID"] || "").toLowerCase().includes(query) ||
      String(row["Employee Name"] || "").toLowerCase().includes(query) ||
      String(row["Request Type"] || "").toLowerCase().includes(query) ||
      String(row["Status"] || "").toLowerCase().includes(query)
    );
  });

  return (
    <section className="content">
      <div className="page-heading">
        <div>
          <h1>My Requests</h1>
          <p>View and track all your submitted requests.</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>My Requests</h2>
        </div>

        <div className="table">
          <div className="table-row table-head">
            <span>Request ID</span>
            <span>Type</span>
            <span>Date</span>
            <span>Status</span>
          </div>

          {loading && <p style={{ padding: "12px 4px" }}>Loading...</p>}

          {!loading && filteredRequests.length === 0 && (
            <p style={{ padding: "12px 4px", color: "#8991a2" }}>
              {query ? "No matching requests." : "No requests yet."}
            </p>
          )}

          {!loading &&
            filteredRequests.map((row) => (
              <div className="table-row" key={row["Request ID"]}>
                <span>{row["Request ID"]}</span>
                <span>{row["Request Type"]}</span>
                <span>{row["Start Date"]}</span>
                <span
                  className={`status ${statusClassFor(row["Status"])}`}
                >
                  {row["Status"]}
                </span>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

/* =========================
   NOTIFICATIONS
========================= */

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetch("https://michel2.app.n8n.cloud/webhook/dashboard-data")
      .then((res) => res.json())
      .then((data) => {
        const rows = data.allRequests || [];

        const items = rows.map((row) => {
          const type = row["Request Type"] || "Request";
          const status = row["Status"] || "Pending";
          const id = row["Request ID"];

          let title = `${type} submitted`;
          let message = `Your ${type} is awaiting approval.`;

          if (status === "Approved") {
            title = `${type} approved`;
            message = `Your ${type} has been approved.`;
          } else if (status === "Rejected") {
            title = `${type} rejected`;
            message = `Your ${type} has been rejected.`;
          }

          return {
            id,
            title,
            message,
            date: row["Start Date"] || "",
          };
        });

        setNotifications(items);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load notifications:", error);
        setLoading(false);
      });
  }, []);

  return (
    <section className="content">
      <div className="page-heading">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated on your request activity.</p>
        </div>
      </div>

      <div className="card">
        {loading && <p style={{ padding: "12px 4px" }}>Loading...</p>}

        {!loading && notifications.length === 0 && (
          <p style={{ padding: "12px 4px", color: "#8991a2" }}>
            No notifications yet.
          </p>
        )}

        {!loading &&
          notifications.map((note) => (
            <div className="notification-item" key={note.id}>
              <strong>{note.title}</strong>
              <p>{note.message}</p>
              <small>{note.date}</small>
            </div>
          ))}
      </div>
    </section>
  );
}

/* =========================
   PROFILE
========================= */

function Profile() {
  const [fullName, setFullName] = useState("Michel Agboola");
  const [email, setEmail] = useState("michel@example.com");
  const [role, setRole] = useState("Employee");

  const handleUpdate = (event) => {
    event.preventDefault();
    alert("Profile updated!");
  };

  return (
    <section className="content">
      <div className="page-heading">
        <div>
          <h1>Profile</h1>
          <p>Manage your account information.</p>
        </div>
      </div>

      <div className="card profile-top-card">
        <div className="profile-avatar">MA</div>
        <h2>{fullName}</h2>
        <p className="profile-role-tag">{role}</p>
      </div>

      <div className="card profile-details-card">
        <h2 className="profile-section-title">Account Details</h2>

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input type="text" value={role} readOnly />
          </div>

          <button type="submit" className="secondary-btn">
            Update profile
          </button>
        </form>
      </div>
    </section>
  );
}

/* =========================
   SMALL COMPONENTS
========================= */

function Stat({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
      <div className="stat-icon">{icon}</div>
    </div>
  );
}

function RequestRow({ id, employee, type, status, statusClass }) {
  return (
    <div className="table-row">
      <span>{id}</span>
      <span>{employee}</span>
      <span>{type}</span>
      <span className={`status ${statusClass}`}>{status}</span>
    </div>
  );
}

function TypeItem({ name, count }) {
  return (
    <div className="type-item">
      <span>□ {name}</span>
      <strong>{count}</strong>
    </div>
  );
}

/* =========================
   LOGIN
========================= */

const DEMO_EMAIL = "michel@example.com";
const DEMO_PASSWORD = "password123";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setError("");
      onLogin();
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <h2>Storhet</h2>
          <span>ApprovalFlow</span>
        </div>

        <h1>Sign in</h1>
        <p>Access your approval dashboard.</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="primary-btn login-btn">
            Sign in
          </button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <button type="button" className="secondary-btn google-btn" disabled>
          Continue with Google (coming soon)
        </button>

        <p className="login-hint">
          Demo credentials: {DEMO_EMAIL} / {DEMO_PASSWORD}
        </p>
      </div>
    </div>
  );
}

/* =========================
   MAIN APP COMPONENT
========================= */

function App() {
  const [currentPage, setPage] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("approvalflow_loggedIn") === "true"
  );

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={() => {
          sessionStorage.setItem("approvalflow_loggedIn", "true");
          setIsLoggedIn(true);
        }}
      />
    );
  }

  const handleLogout = () => {
    sessionStorage.removeItem("approvalflow_loggedIn");
    setIsLoggedIn(false);
    setPage("dashboard");
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <a href="/" className="sidebar-brand">
          <h2>Storhet</h2>
          <span>ApprovalFlow</span>
        </a>

        <nav className="sidebar-nav">
          <button
            className={currentPage === "dashboard" ? "active" : ""}
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={currentPage === "new-request" ? "active" : ""}
            onClick={() => setPage("new-request")}
          >
            New Request
          </button>
          <button
            className={currentPage === "requests" ? "active" : ""}
            onClick={() => setPage("requests")}
          >
            My Requests
          </button>
          <button
            className={currentPage === "notifications" ? "active" : ""}
            onClick={() => setPage("notifications")}
          >
            Notifications
          </button>
          <button
            className={currentPage === "profile" ? "active" : ""}
            onClick={() => setPage("profile")}
          >
            Profile
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-search">
            <input
              type="text"
              placeholder="Search requests, users..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                if (event.target.value.trim() !== "") {
                  setPage("requests");
                }
              }}
            />
          </div>
          <div className="topbar-profile">
            <span>Michel Agboola</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {currentPage === "dashboard" && <Dashboard setPage={setPage} />}
        {currentPage === "new-request" && <NewRequest />}
        {currentPage === "requests" && (
          <MyRequests searchTerm={searchTerm} />
        )}
        {currentPage === "notifications" && <Notifications />}
        {currentPage === "profile" && <Profile />}
      </main>
    </div>
  );
}

export default App;