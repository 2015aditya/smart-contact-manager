# 📸 User Profile Image Upload Feature

## Overview

Added profile image upload functionality to the User Dashboard. Users can now upload, view, and update their profile pictures.

## ✅ Implementation Complete

### Backend Changes

#### 1. **User Entity** (`User.java`)
- Added `imagePath` field to store the path to user profile image
- Field is nullable (users can have no image)

#### 2. **DTOs Updated**
- **AuthResponse**: Added `imagePath` field, includes image in login/registration responses
- **UserDTO**: Added `imagePath` field for user information transfer

#### 3. **File Storage Service** (`FileStorageService.java`)
- Handles file uploads to `uploads/` directory
- Validates file type (images only)
- Validates file size (max 5MB)
- Generates unique filenames: `{userId}_{timestamp}{extension}`
- Deletes old images when new ones are uploaded

#### 4. **User Controller** (`UserController.java`)
- **GET `/api/user/profile`**: Get current user profile information
- **POST `/api/user/profile/image`**: Upload/update user profile image
- **GET `/api/user/images/{filename}`**: Serve uploaded images

#### 5. **User Service** (`UserService.java`)
- Added `updateUserImage()`: Update user's image path
- Added `getCurrentUser()`: Get current user information

#### 6. **Security Configuration**
- Updated `SecurityConfig` to allow:
  - `/api/user/**` - Requires authentication (USER or ADMIN role)
  - `/api/user/images/**` - Public access to serve images

#### 7. **Application Properties**
- Added file upload configuration:
  ```properties
  file.upload-dir=uploads
  spring.servlet.multipart.enabled=true
  spring.servlet.multipart.max-file-size=5MB
  spring.servlet.multipart.max-request-size=5MB
  ```

### Frontend Changes

#### 1. **API Service** (`api.js`)
- Added `userAPI` object with:
  - `getProfile()`: Fetch user profile
  - `uploadImage(file)`: Upload profile image (multipart/form-data)
  - `getImageUrl(imagePath)`: Get full URL for image display

#### 2. **User Dashboard** (`UserDashboard.jsx`)
- Added user profile section at the top:
  - Profile image display (circular, 120x120px)
  - User name and email
  - Image upload button (camera icon)
  - Image preview before saving
  - Save/Cancel buttons when new image is selected

#### 3. **Features Added**
- **Image Upload**: Click on profile image or camera icon to select image
- **Image Preview**: Shows preview of selected image before upload
- **Image Validation**: 
  - Only image files allowed
  - Maximum file size: 5MB
- **Image Display**: Shows uploaded image or default avatar (👤 emoji)
- **Real-time Updates**: Profile updates immediately after upload
- **Error Handling**: Shows error messages for invalid files or upload failures

## 📁 File Structure

### Backend Files Created/Modified:
```
backend/
├── src/main/java/com/smartcontactmanager/
│   ├── controller/
│   │   └── UserController.java (NEW)
│   ├── service/
│   │   └── FileStorageService.java (NEW)
│   ├── entity/
│   │   └── User.java (MODIFIED - added imagePath field)
│   ├── dto/
│   │   ├── AuthResponse.java (MODIFIED - added imagePath)
│   │   └── UserDTO.java (MODIFIED - added imagePath)
│   └── security/
│       └── SecurityConfig.java (MODIFIED - added user endpoints)
└── src/main/resources/
    └── application.properties (MODIFIED - added file upload config)
```

### Frontend Files Modified:
```
frontend/
├── src/
│   ├── services/
│   │   └── api.js (MODIFIED - added userAPI)
│   └── pages/
│       └── UserDashboard.jsx (MODIFIED - added profile section)
```

## 🎯 How It Works

### Image Upload Flow:

1. **User clicks on profile image** → File input dialog opens
2. **User selects image file** → Image preview shown
3. **User clicks "Save Image"** → Image uploaded to backend
4. **Backend processes image**:
   - Validates file type and size
   - Deletes old image (if exists)
   - Generates unique filename
   - Saves to `uploads/` directory
   - Updates user record in database
5. **Frontend receives response** → Updates profile display
6. **Image displayed** → URL: `http://localhost:8080/api/user/images/{filename}`

### Database Schema:

The `users` table now includes:
```sql
imagePath VARCHAR(500) NULL
```

Hibernate will automatically add this column when the application starts (due to `spring.jpa.hibernate.ddl-auto=update`).

## 🔧 Configuration

### Backend Configuration:

**application.properties:**
```properties
# File Upload Configuration
file.upload-dir=uploads
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
```

### Storage Location:

Images are stored in: `backend/uploads/` directory
- Directory is created automatically if it doesn't exist
- Files are named: `{userId}_{timestamp}{extension}`
- Example: `1_1704123456789.jpg`

## 📝 API Endpoints

### 1. Get User Profile
```
GET /api/user/profile
Authorization: Bearer {JWT_TOKEN}

Response:
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "ROLE_USER",
  "imagePath": "uploads/1_1704123456789.jpg"
}
```

### 2. Upload Profile Image
```
POST /api/user/profile/image
Authorization: Bearer {JWT_TOKEN}
Content-Type: multipart/form-data

Body: file (image file)

Response:
{
  "message": "Image uploaded successfully",
  "imagePath": "uploads/1_1704123456789.jpg",
  "imageUrl": "/api/user/images/1_1704123456789.jpg"
}
```

### 3. Get Image
```
GET /api/user/images/{filename}

Response: Image file (binary)
Content-Type: image/jpeg (or png, gif, etc.)
```

## 🎨 UI Features

### Profile Section:
- **Circular Profile Image** (120x120px)
- **Default Avatar**: 👤 emoji if no image uploaded
- **Hover Effect**: Image scales slightly on hover
- **Camera Icon**: Bottom-right overlay to indicate upload capability
- **User Info**: Name and email displayed next to image
- **Save/Cancel Buttons**: Shown when new image is selected

### User Experience:
- ✅ Click anywhere on profile image to upload
- ✅ Image preview before saving
- ✅ Loading state during upload
- ✅ Success/error messages
- ✅ Automatic profile refresh after upload
- ✅ Responsive design

## 🔒 Security Features

1. **Authentication Required**: Only authenticated users can upload images
2. **File Type Validation**: Only image files allowed (image/*)
3. **File Size Validation**: Maximum 5MB per file
4. **Unique Filenames**: Prevents filename collisions
5. **User Isolation**: Users can only update their own profile images
6. **Automatic Cleanup**: Old images deleted when new ones uploaded

## 🚀 Usage

### For Users:

1. **Navigate to User Dashboard**
2. **Click on your profile image** (or camera icon)
3. **Select an image file** from your device
4. **Preview the image** (if it looks good)
5. **Click "Save Image"** to upload
6. **Done!** Your profile image is now updated

### Supported Image Formats:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- And other image formats supported by the browser

## ⚠️ Important Notes

1. **Upload Directory**: The `uploads/` directory should be in `.gitignore` to avoid committing user images to version control
2. **File Permissions**: Ensure the application has write permissions to the uploads directory
3. **Storage Location**: Images are stored on the local filesystem. For production, consider using cloud storage (AWS S3, Azure Blob, etc.)
4. **Database**: The `imagePath` field will be automatically added to the `users` table when the application starts
5. **Image Serving**: Images are served directly by the backend. For production, consider using a CDN or reverse proxy

## 🐛 Troubleshooting

### Image not uploading:
- Check file size (must be < 5MB)
- Check file type (must be an image)
- Verify backend has write permissions to `uploads/` directory
- Check backend logs for errors

### Image not displaying:
- Verify image URL is correct
- Check if file exists in `uploads/` directory
- Verify SecurityConfig allows access to `/api/user/images/**`
- Check browser console for CORS errors

### Old image not deleted:
- Check file permissions
- Verify old image path is correct
- Check backend logs for deletion errors

## 📊 Future Enhancements

Possible improvements:
- [ ] Image cropping/editing before upload
- [ ] Multiple image sizes (thumbnail, medium, large)
- [ ] Image compression
- [ ] Cloud storage integration (AWS S3, etc.)
- [ ] Image gallery for users
- [ ] Avatar generation for users without images

---

**Feature Implementation Complete! ✅**

Users can now upload and manage their profile images directly from the User Dashboard.
