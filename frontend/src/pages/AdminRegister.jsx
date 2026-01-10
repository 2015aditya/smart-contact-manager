import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";

function AdminRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Sending admin register data:", formData);

      const response = await authAPI.adminRegister(formData);

      console.log("Admin register response:", response.data);

      const { token, email, name, role, userId } = response.data;

      // store auth info
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ email, name, role, userId })
      );

      // redirect
      navigate("/admin/dashboard");

    } catch (err) {
      // 🔥 IMPORTANT DEBUG
      console.error("ADMIN REGISTER ERROR:", err);

      if (err.response) {
        console.error("STATUS:", err.response.status);
        console.error("DATA:", err.response.data);
      }

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Admin registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg" style={{ borderRadius: "20px" }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div style={{ fontSize: "3rem" }}>👨‍💼</div>
                  <h2 className="fw-bold">Admin Registration</h2>
                  <p className="text-muted">Create a new admin account</p>
                </div>

                {error && (
                  <Alert variant="danger">
                    ⚠️ {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Admin Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100"
                    disabled={loading}
                    variant="danger"
                  >
                    {loading ? "Creating..." : "Create Admin Account"}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <Link to="/admin/login">Admin Login</Link>
                </div>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminRegister;
