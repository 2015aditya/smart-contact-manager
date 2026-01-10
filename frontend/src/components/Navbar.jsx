import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = token ? JSON.parse(localStorage.getItem('user') || '{}') : null
  const isAdmin = user?.role === 'ROLE_ADMIN'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" style={{ 
      background: 'rgba(30, 41, 59, 0.95) !important',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" style={{ 
          fontSize: '1.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          📇 Smart Contact Manager
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {!token && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/login">
                  Admin Login
                </Nav.Link>
              </>
            )}
            {token && !isAdmin && (
              <Nav.Link as={Link} to="/dashboard">
                User Dashboard
              </Nav.Link>
            )}
            {token && isAdmin && (
              <Nav.Link as={Link} to="/admin/dashboard">
                Admin Dashboard
              </Nav.Link>
            )}
          </Nav>
          {token && (
            <Nav>
              <span className="navbar-text me-3 text-light">
                Welcome, {user?.name}
              </span>
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          )}
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar
