import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Card, Table, Button, Form, Modal, Alert, InputGroup } from 'react-bootstrap'
import { contactAPI, userAPI } from '../services/api'

function UserDashboard() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
  })
  const [userProfile, setUserProfile] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadContacts()
    loadUserProfile()
  }, [])

  const loadContacts = async () => {
    try {
      setLoading(true)
      const response = await contactAPI.getAll()
      setContacts(response.data)
      setError('')
    } catch (err) {
      setError('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      loadContacts()
      return
    }

    try {
      setLoading(true)
      const response = await contactAPI.search(searchKeyword)
      setContacts(response.data)
      setError('')
    } catch (err) {
      setError('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleOpenModal = (contact = null) => {
    if (contact) {
      setEditingContact(contact)
      setFormData({
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        description: contact.description || '',
      })
    } else {
      setEditingContact(null)
      setFormData({
        name: '',
        email: '',
        phone: '',
        description: '',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingContact(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      description: '',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingContact) {
        await contactAPI.update(editingContact.id, formData)
        setSuccess('Contact updated successfully')
      } else {
        await contactAPI.create(formData)
        setSuccess('Contact added successfully')
      }
      handleCloseModal()
      loadContacts()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactAPI.delete(id)
        setSuccess('Contact deleted successfully')
        loadContacts()
        setTimeout(() => setSuccess(''), 3000)
      } catch (err) {
        setError('Failed to delete contact')
      }
    }
  }

  const loadUserProfile = async () => {
    try {
      const response = await userAPI.getProfile()
      setUserProfile(response.data)
      if (response.data.imagePath) {
        setImagePreview(userAPI.getImageUrl(response.data.imagePath))
      }
    } catch (err) {
      console.error('Failed to load user profile:', err)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }

      // Show preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = async () => {
    const file = fileInputRef.current?.files[0]
    if (!file) {
      setError('Please select an image file')
      return
    }

    try {
      setUploadingImage(true)
      setError('')
      const response = await userAPI.uploadImage(file)
      
      // Update user profile
      await loadUserProfile()
      
      // Update localStorage if user info is stored there
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        user.imagePath = response.data.imagePath
        localStorage.setItem('user', JSON.stringify(user))
      }
      
      setSuccess('Profile image updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image')
      setImagePreview(null)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImageCancel = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // Reload original image
    if (userProfile?.imagePath) {
      setImagePreview(userAPI.getImageUrl(userProfile.imagePath))
    } else {
      setImagePreview(null)
    }
  }

  // Get user info from localStorage
  const storedUser = localStorage.getItem('user')
  const currentUser = storedUser ? JSON.parse(storedUser) : null

  return (
    <div style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Container>
        {/* User Profile Section */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow-lg fade-in" style={{ borderRadius: '20px', border: 'none' }}>
              <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-4 flex-wrap">
                  {/* Profile Image */}
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '4px solid #667eea',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease',
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      {imagePreview || (userProfile?.imagePath && userAPI.getImageUrl(userProfile.imagePath)) ? (
                        <img
                          src={imagePreview || userAPI.getImageUrl(userProfile.imagePath)}
                          alt="Profile"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '3rem', color: 'white' }}>👤</div>
                      )}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          background: '#667eea',
                          color: 'white',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '1.2rem',
                          border: '2px solid white',
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          fileInputRef.current?.click()
                        }}
                      >
                        📷
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>

                  {/* User Info */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h3 className="fw-bold mb-1" style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {userProfile?.name || currentUser?.name || 'User'}
                    </h3>
                    <p className="text-muted mb-2">{userProfile?.email || currentUser?.email || ''}</p>
                    {imagePreview && imagePreview !== userAPI.getImageUrl(userProfile?.imagePath) && (
                      <div className="d-flex gap-2 mt-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={handleImageUpload}
                          disabled={uploadingImage}
                          style={{ borderRadius: '8px', fontWeight: '600' }}
                        >
                          {uploadingImage ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Uploading...
                            </>
                          ) : (
                            '💾 Save Image'
                          )}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleImageCancel}
                          disabled={uploadingImage}
                          style={{ borderRadius: '8px', fontWeight: '600' }}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Contacts Section */}
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
                      📇 My Contacts
                    </h2>
                    <p className="text-muted mb-0">Manage all your contacts in one place</p>
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={() => handleOpenModal()}
                    style={{ 
                      borderRadius: '12px',
                      padding: '10px 24px',
                      fontWeight: '600'
                    }}
                  >
                    ➕ Add Contact
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

              <InputGroup className="mb-4" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <Form.Control
                  type="text"
                  placeholder="🔍 Search by name, email, or phone..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  style={{ 
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px 0 0 12px'
                  }}
                />
                <Button 
                  variant="primary" 
                  onClick={handleSearch}
                  style={{ borderRadius: '0' }}
                >
                  Search
                </Button>
                {searchKeyword && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => {
                      setSearchKeyword('')
                      loadContacts()
                    }}
                    style={{ borderRadius: '0 12px 12px 0' }}
                  >
                    Clear
                  </Button>
                )}
              </InputGroup>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted">Loading contacts...</p>
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
                  <h4 className="mb-2">No contacts found</h4>
                  <p className="text-muted mb-3">Add your first contact to get started!</p>
                  <Button variant="primary" onClick={() => handleOpenModal()}>
                    ➕ Add Your First Contact
                  </Button>
                </div>
              ) : (
                <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
                  <Table striped bordered hover responsive className="mb-0">
                    <thead>
                      <tr>
                        <th style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '16px' }}>👤 Name</th>
                        <th style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '16px' }}>📧 Email</th>
                        <th style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '16px' }}>📱 Phone</th>
                        <th style={{ background: 'linear-gradient(135deg, #667eea 0%, #667eea 100%)', color: 'white', border: 'none', padding: '16px' }}>📝 Description</th>
                        <th style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '16px' }}>⚙️ Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact, index) => (
                        <tr key={contact.id} style={{ 
                          animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                        }}>
                          <td style={{ padding: '16px', fontWeight: '600' }}>{contact.name}</td>
                          <td style={{ padding: '16px' }}>{contact.email || <span className="text-muted">-</span>}</td>
                          <td style={{ padding: '16px' }}>{contact.phone || <span className="text-muted">-</span>}</td>
                          <td style={{ padding: '16px' }}>{contact.description || <span className="text-muted">-</span>}</td>
                          <td style={{ padding: '16px' }}>
                            <Button
                              variant="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => handleOpenModal(contact)}
                              style={{ borderRadius: '8px', fontWeight: '600' }}
                            >
                              ✏️ Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(contact.id)}
                              style={{ borderRadius: '8px', fontWeight: '600' }}
                            >
                              🗑️ Delete
                            </Button>
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

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none'
        }}>
          <Modal.Title className="fw-bold">
            {editingContact ? '✏️ Edit Contact' : '➕ Add New Contact'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter contact name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ border: 'none' }}>
            <Button 
              variant="secondary" 
              onClick={handleCloseModal}
              style={{ borderRadius: '10px', fontWeight: '600' }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              style={{ borderRadius: '10px', fontWeight: '600' }}
            >
              {editingContact ? '💾 Update Contact' : '➕ Add Contact'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default UserDashboard
