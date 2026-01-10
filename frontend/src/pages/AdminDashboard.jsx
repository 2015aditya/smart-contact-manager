import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Button, Alert, Modal } from 'react-bootstrap'
import { adminAPI } from '../services/api'

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showContactsModal, setShowContactsModal] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllUsers()
      setUsers(response.data)
      setError('')
    } catch (err) {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? All their contacts will also be deleted.')) {
      try {
        await adminAPI.deleteUser(id)
        setSuccess('User deleted successfully')
        loadUsers()
        setTimeout(() => setSuccess(''), 3000)
      } catch (err) {
        setError('Failed to delete user')
      }
    }
  }

  const handleViewContacts = async (userId) => {
    try {
      const response = await adminAPI.getUserContacts(userId)
      setSelectedUser({ id: userId, contacts: response.data })
      setShowContactsModal(true)
    } catch (err) {
      setError('Failed to load contacts')
    }
  }

  const handleCloseContactsModal = () => {
    setShowContactsModal(false)
    setSelectedUser(null)
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Container>
        <Row>
          <Col>
            <Card className="shadow-lg fade-in" style={{ borderRadius: '20px', border: 'none' }}>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                  <div>
                    <h2 className="fw-bold mb-1" style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      👨‍💼 Admin Dashboard
                    </h2>
                    <p className="text-muted mb-0">Manage all users and their contacts</p>
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={loadUsers}
                    style={{ 
                      borderRadius: '12px',
                      padding: '10px 24px',
                      fontWeight: '600'
                    }}
                  >
                    🔄 Refresh
                  </Button>
                </div>

                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')} style={{ borderRadius: '12px' }}>
                    ⚠️ {error}
                  </Alert>
                )}

                {success && (
                  <Alert variant="success" dismissible onClose={() => setSuccess('')} style={{ borderRadius: '12px' }}>
                    ✅ {success}
                  </Alert>
                )}

                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading users...</p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-5">
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
                    <h4 className="mb-2">No users found</h4>
                    <p className="text-muted">No users registered yet.</p>
                  </div>
                ) : (
                  <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <Table striped bordered hover responsive className="mb-0">
                      <thead>
                        <tr>
                          <th style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '16px' }}>#</th>
                          <th style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '16px' }}>👤 Name</th>
                          <th style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '16px' }}>📧 Email</th>
                          <th style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '16px' }}>🎭 Role</th>
                          <th style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '16px' }}>📇 Contacts</th>
                          <th style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '16px' }}>⚙️ Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={user.id} style={{ 
                            animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                          }}>
                            <td style={{ padding: '16px', fontWeight: '600' }}>{user.id}</td>
                            <td style={{ padding: '16px', fontWeight: '600' }}>{user.name}</td>
                            <td style={{ padding: '16px' }}>{user.email}</td>
                            <td style={{ padding: '16px' }}>
                              <span className={`badge ${user.role === 'ROLE_ADMIN' ? 'bg-danger' : 'bg-primary'}`} style={{ borderRadius: '8px', padding: '6px 12px' }}>
                                {user.role === 'ROLE_ADMIN' ? '👑 Admin' : '👤 User'}
                              </span>
                            </td>
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              <span className="badge bg-info" style={{ borderRadius: '8px', padding: '6px 12px', fontSize: '1rem' }}>
                                {user.contacts?.length || 0}
                              </span>
                            </td>
                            <td style={{ padding: '16px' }}>
                              <Button
                                variant="info"
                                size="sm"
                                className="me-2"
                                onClick={() => handleViewContacts(user.id)}
                                style={{ borderRadius: '8px', fontWeight: '600' }}
                              >
                                👁️ View Contacts
                              </Button>
                              {user.role !== 'ROLE_ADMIN' && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                  style={{ borderRadius: '8px', fontWeight: '600' }}
                                >
                                  🗑️ Delete
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Contacts Modal */}
      <Modal show={showContactsModal} onHide={handleCloseContactsModal} size="lg" centered>
        <Modal.Header closeButton style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none'
        }}>
          <Modal.Title className="fw-bold">
            📇 Contacts for User ID: {selectedUser?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser?.contacts?.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
              <h5 className="mb-2">No Contacts</h5>
              <p className="text-muted">This user has no contacts yet.</p>
            </div>
          ) : (
            <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '16px' }}>👤 Name</th>
                    <th style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '16px' }}>📧 Email</th>
                    <th style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '16px' }}>📱 Phone</th>
                    <th style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '16px' }}>📝 Description</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUser?.contacts?.map((contact) => (
                    <tr key={contact.id}>
                      <td style={{ padding: '16px', fontWeight: '600' }}>{contact.name}</td>
                      <td style={{ padding: '16px' }}>{contact.email || <span className="text-muted">-</span>}</td>
                      <td style={{ padding: '16px' }}>{contact.phone || <span className="text-muted">-</span>}</td>
                      <td style={{ padding: '16px' }}>{contact.description || <span className="text-muted">-</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ border: 'none' }}>
          <Button 
            variant="secondary" 
            onClick={handleCloseContactsModal}
            style={{ borderRadius: '10px', fontWeight: '600' }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AdminDashboard
