import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Welcome() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            {/* Hero Section */}
            <Card className="text-center fade-in" style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              border: 'none',
              marginBottom: '4rem'
            }}>
              <Card.Body className="p-5">
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📇</div>
                <h1 className="display-3 mb-4 fw-bold" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Smart Contact Manager
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.3rem', color: '#64748b' }}>
                  Manage your contacts efficiently and securely. 
                  <br />
                  Keep all your important contacts in one place with style.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Button 
                    as={Link} 
                    to="/register" 
                    variant="primary" 
                    size="lg"
                    style={{ 
                      padding: '12px 32px',
                      fontSize: '1.1rem',
                      borderRadius: '12px'
                    }}
                  >
                    🚀 Get Started
                  </Button>
                  <Button 
                    as={Link} 
                    to="/login" 
                    variant="outline-primary" 
                    size="lg"
                    style={{ 
                      padding: '12px 32px',
                      fontSize: '1.1rem',
                      borderRadius: '12px',
                      borderWidth: '2px'
                    }}
                  >
                    🔐 Login
                  </Button>
                  <Button 
                    as={Link} 
                    to="/admin/login" 
                    variant="outline-danger" 
                    size="lg"
                    style={{ 
                      padding: '12px 32px',
                      fontSize: '1.1rem',
                      borderRadius: '12px',
                      borderWidth: '2px'
                    }}
                  >
                    👨‍💼 Admin
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Features Section */}
            <Row className="g-4">
              <Col md={4} className="slide-in" style={{ animationDelay: '0.1s' }}>
                <div className="feature-card h-100">
                  <div className="feature-icon">✨</div>
                  <h3 className="mb-3 fw-bold">Easy Management</h3>
                  <p style={{ color: '#64748b', lineHeight: '1.8' }}>
                    Add, update, and delete your contacts with ease. 
                    Simple and intuitive interface designed for productivity.
                  </p>
                </div>
              </Col>
              <Col md={4} className="slide-in" style={{ animationDelay: '0.2s' }}>
                <div className="feature-card h-100">
                  <div className="feature-icon">🔍</div>
                  <h3 className="mb-3 fw-bold">Search & Filter</h3>
                  <p style={{ color: '#64748b', lineHeight: '1.8' }}>
                    Quickly find contacts by name, email, or phone number. 
                    Powerful search functionality at your fingertips.
                  </p>
                </div>
              </Col>
              <Col md={4} className="slide-in" style={{ animationDelay: '0.3s' }}>
                <div className="feature-card h-100">
                  <div className="feature-icon">🔒</div>
                  <h3 className="mb-3 fw-bold">Secure & Private</h3>
                  <p style={{ color: '#64748b', lineHeight: '1.8' }}>
                    Your data is protected with JWT authentication. 
                    Only you can access your contacts securely.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Additional Info */}
            <Row className="mt-5">
              <Col className="text-center">
                <Card style={{ 
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '16px'
                }}>
                  <Card.Body className="p-4">
                    <h4 className="mb-3">🌟 Why Choose Smart Contact Manager?</h4>
                    <Row className="g-3">
                      <Col md={3}>
                        <div>
                          <strong>⚡ Fast</strong>
                          <p className="small text-muted mb-0">Lightning quick operations</p>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div>
                          <strong>🎨 Beautiful</strong>
                          <p className="small text-muted mb-0">Modern, attractive design</p>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div>
                          <strong>🔐 Secure</strong>
                          <p className="small text-muted mb-0">Enterprise-grade security</p>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div>
                          <strong>📱 Responsive</strong>
                          <p className="small text-muted mb-0">Works on all devices</p>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Welcome
