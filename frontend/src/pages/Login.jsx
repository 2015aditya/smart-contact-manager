import React, { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login(formData)
      const { token, email, name, role, userId } = response.data

      // Store token and user info
      localStorage.setItem('token', token)
      localStorage.setItem(
        'user',
        JSON.stringify({ email, name, role, userId })
      )

      // Redirect based on role
      if (role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg fade-in" style={{ borderRadius: '20px', border: 'none' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                  <Card.Title>
                    <h2 className="fw-bold mb-0">Welcome Back!</h2>
                    <p className="text-muted mt-2">Login to your account</p>
                  </Card.Title>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4" style={{ borderRadius: '12px' }}>
                    ⚠️ {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">
                      📧 Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                      style={{ padding: '12px 16px' }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">
                      🔑 Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                      style={{ padding: '12px 16px' }}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                    style={{ 
                      padding: '12px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      borderRadius: '12px'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : (
                      '🚀 Login'
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="mb-2">
                    Don't have an account?{' '}
                    <Link to="/register" style={{ 
                      color: '#6366f1', 
                      textDecoration: 'none',
                      fontWeight: '600'
                    }}>
                      Register here
                    </Link>
                  </p>
                  <p className="mb-0">
                    <Link to="/admin/login" style={{ 
                      color: '#8b5cf6', 
                      textDecoration: 'none',
                      fontWeight: '600'
                    }}>
                      👨‍💼 Admin Login
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login
