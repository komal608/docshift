# DocShift - Technical Stack Report

**Project Name:** DocShift  
**Document Version:** 1.0  
**Date:** January 2025  
**Classification:** Official Technical Documentation

---

## Executive Summary

This document provides a comprehensive overview of the technical stack employed in the **DocShift** document processing and AI-powered platform. DocShift is a full-stack web application built with Python Flask, integrating cloud storage, Firebase real-time database, and AI-powered document operations.

---

## 1. Backend Framework & Core Libraries

- **Framework:** Flask 3.0.3
- **CORS Handling:** Flask-CORS 5.0.0
- **Security & Password Hashing:** Werkzeug 3.0.3
- **Environment Variables:** python-dotenv 1.0.1
- **WSGI Server (Production-Ready):** Waitress 3.0.1
- **Session Management:** Flask built-in sessions with `secret_key`

---

## 2. Frontend Technologies

- **Templating Engine:** Jinja2 3.1.4
- **Client-Side Scripting:** Vanilla JavaScript
- **Styling:** Custom CSS
- **Fonts:** Google Fonts (Poppins, IBM Plex Mono, Archivo Narrow)
- **AJAX:** Fetch API for asynchronous operations
- **File Handling:** FormData API for multipart uploads

---

## 3. Database Architecture

### Primary Database: Firebase Realtime Database
- **Service:** Firebase Realtime Database
- **SDK:** firebase-admin 6.5.0
- **Database URL:** `docshift-86065-default-rtdb.firebaseio.com`
- **Authentication:** Service Account JSON (`docshift.json`)
- **Data Structure:**
  - `/users/` - User profiles and authentication data
  - `/user_storage/` - Document storage metadata
  - `/credentials/` - API keys and service credentials (Cloudinary, OpenRouter)

### Secondary Database: SQLite
- **Purpose:** File conversion history logging
- **Database File:** `file_conversion.db`
- **Tables:**
  - `conversions` - Tracks all document conversion operations with timestamps

---

## 4. Cloud Storage & CDN

- **Service Provider:** Cloudinary
- **SDK:** cloudinary 1.41.0
- **Cloud Name:** `dvdeflyta`
- **Features Used:**
  - File upload and storage
  - Secure URL generation
  - Resource management

---

## 5. AI Integration Stack

- **Provider/API:** OpenRouter Chat Completions API
- **Configured Model:** `gpt-4o`
- **Endpoint:** `https://openrouter.ai/api/v1/chat/completions`
- **HTTP Client:** requests 2.32.3
- **Use Cases:**
  - AI-powered chat agent
  - Text summarization
  - Resume analysis
  - PDF comparison and analysis
  - Table data conversion

---

## 6. Document Processing Libraries

### PDF Operations
- **Core Library:** PyMuPDF (fitz) 1.24.14
- **PDF Manipulation:** PyPDF2 3.0.1
- **PDF Generation:** reportlab 4.2.5
- **Features:**
  - PDF merging, splitting, compression
  - Page removal and extraction
  - PDF to image conversion
  - Image to PDF conversion

### Office Document Handling
- **Word Processing:** python-docx 1.1.2
- **Excel Processing:** openpyxl 3.1.5
- **PowerPoint Generation:** python-pptx 1.0.2

---

## 7. Image Processing

- **Library:** Pillow (PIL) 11.0.0
- **Background Removal:** rembg 2.0.59
- **Features:**
  - Image compression and optimization
  - Format conversion (PNG, JPEG, WebP)
  - Background removal from images

---

## 8. Speech & Audio Processing

- **Text-to-Speech:** gTTS 2.5.4
- **Speech Recognition:** SpeechRecognition 3.11.0
- **Audio Format Conversion:** pydub 0.25.1
- **Dependencies:**
  - pyaudio 0.2.14 (audio I/O)

---

## 9. Email Services

- **SMS/WhatsApp API:** Twilio SDK (twilio 9.3.7)
- **SMTP Protocol:** smtplib (Python standard library)
- **Email Client:** imaplib (Python standard library)

---

## 10. Authentication & Security

- **Password Hashing:** Werkzeug security utilities
- **Session Management:** Flask sessions with secure cookies
- **Login System:** Custom decorators (`@login_required`)
- **Phone/Email Verification:** OTP-based verification
- **Phone Number Validation:** phonenumbers 8.13.50

---

## 11. Deployment & Runtime

- **Python Version:** Python 3.12.4
- **Virtual Environment:** venv
- **Production Server:** Waitress WSGI Server
- **Environment Configuration:** `.env` files for sensitive credentials
- **Static File Serving:** Flask static file handling

---

## 12. Technology Summary

**Core Technologies:**
- Python, Flask, Flask-CORS, Werkzeug
- HTML, CSS, JavaScript, Jinja2
- Firebase Realtime Database, SQLite
- OpenRouter (`gpt-4o`)
- Cloudinary

**Key Libraries:**
- PyMuPDF, PyPDF2, reportlab, python-docx, openpyxl
- Pillow, rembg
- gTTS, SpeechRecognition, pydub
- Twilio, requests, firebase-admin

---

## 13. Architecture Patterns

- **Design Pattern:** MVC (Model-View-Controller)
- **API Architecture:** RESTful endpoints
- **Authentication:** Session-based with server-side validation
- **File Storage:** Hybrid (Cloudinary for cloud, local temp storage)
- **Database Access:** Direct SDK calls (Firebase Admin SDK)

---

## 14. External API Integrations

1. **OpenRouter API** - AI/ML model inference
2. **Cloudinary API** - Cloud file storage and CDN
3. **Firebase API** - Real-time database operations
4. **Twilio API** - SMS/WhatsApp messaging

---

## Appendix A: Complete Dependency List

```
cloudinary==1.41.0
firebase-admin==6.5.0
Flask==3.0.3
Flask-Cors==5.0.0
gTTS==2.5.4
Jinja2==3.1.4
openpyxl==3.1.5
phonenumbers==8.13.50
Pillow==11.0.0
pyaudio==0.2.14
pydub==0.25.1
PyMuPDF==1.24.14
PyPDF2==3.0.1
python-docx==1.1.2
python-dotenv==1.0.1
python-pptx==1.0.2
rembg==2.0.59
reportlab==4.2.5
requests==2.32.3
SpeechRecognition==3.11.0
twilio==9.3.7
waitress==3.0.1
Werkzeug==3.0.3
```

---

**Document Control:**
- **Prepared By:** Technical Team
- **Reviewed By:** Project Lead
- **Approved By:** CTO

---

*End of Document*
