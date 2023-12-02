# Process- & Product report

## Process report
* Frontpage
  - CitizenTaxi
  - Process report
  - Thumbnail
  - Svendeprøveprojekt Nov. 2023
  - Daniel Simonsen
* Title page
  - Student: Daniel Simonsen
  - (Company: SKO)
  - Project: CitizenTaxi
  - Education: Datatekniker med speciale i programmering
  - Project period: 06/11/2023 - 01/12/2023
  - Turn-in date: 01/12/2023
  - Presentation date: 07/12/2023
* Reading guide
  - I recommend reading the process report first, because...
  - (Preface - light introduction to the project)
* Table of contents
* Case description
  - Problem statement
  - Target audience
  - Boundary
* Method and technology choices
  - Frontend
  - Backend
  - Database
  - Maps
  - IDE
  - Designing tool
  - Version control & task management
* Project planning
  - Estimated time schedule
  - Actual time schedule
* Conclusion
  - What went well
  - What went wrong
  - What could have been done differently
  - What did I learn
* Log book
* References

## Product report
* Frontpage
  - CitizenTaxi
  - Process report
  - Thumbnail
  - Svendeprøveprojekt Nov. 2023
  - Daniel Simonsen
* Title page
  - Student: Daniel Simonsen
  - (Company: SKO)
  - Project: CitizenTaxi
  - Education: Datatekniker med speciale i programmering
  - Project period: 06/11/2023 - 01/12/2023
  - Turn-in date: 01/12/2023
  - Presentation date: 07/12/2023
* Reading guide
  - I recommend reading the process report first, because...
  - (Preface - light introduction to the project)
* Table of contents
* Product overview
  - Product requirements
  - Database diagram
  - Class diagram
  - Project structure
* Tests
  - Unit tests
  - Integration tests
  - User acceptance tests
* User manual
  - Installation
  - Usage
    - User as Citizen
      - Contact doctor's secretary to create account and note for you
      - Login using details from doctor's secretary
      - View your note and your bookings
      - Editing your note
      - Create a new booking
      - Editing and deleting bookings
    - User as Doctor's secretary
      - Login using details from company
      - Menu of information: Citizens, notes, bookings
        - Citizen
          - View all citizens
          - Create a new citizen
          - Editing and deleting citizens
        - Notes
          - View all notes
          - Create a new note
          - Editing and deleting notes
        - Bookings
          - Bookings disclaimer - ideally the citizen should create their own bookings, but if they are unable to, the doctor's secretary can do it for them
          - View all bookings
          - Create a new booking
          - Editing and deleting bookings
* Technical product documentation
  - Frontend
  - Backend
  - Database
* Conclusion
  - Does this product solve the problem statement?
  - What went well
  - What went wrong
  - What could have been done differently
  - What did I learn
* References

# Common
* Installation of DanhoLibrary
* enums
  - Roles
  - CarHeights
  - HelpingUtils
  - Companions
  - Follows
* Entities
  - AUser, Admin & Citizen
  - Login
  - Booking & Note
* DTOs
  - UserDTO
  - CitizenDTO
  - BookingDTO
  - NoteDTO

# DataAccess
* Reference to Entities
* SeedData
  - 1x Admin
  - 1x Citizen
  - 2x Login
  - 1x Note
  - 2x Booking
* Repositories
  - AUserRepository
    - `GetUserfromLogin(Login login): AUser?`
  - AdminRepository
    - `GetAdminfromLogin(Login login): Admin?`
  - CitizenRepository
    - `GetCitizenfromLogin(Login login): Citizen?`
    - `GetCitizenFromName(string name): Citizen?`
  - LoginRepository
  - NoteRepository
    - `GetNoteFromCitizen(Citizen citizen): Note?`
  - BookingRepository
    - `GetBookingsFromCitizen(Citizen citizen): List<Booking>`

# Business
* Reference to DataAccess
* Models
  - Playloads
    - LoginPlayload
    - UserModifyPlayload
    - NoteModifyPlayload
    - BookingModifyPlayload
  - SessionToken
* Services & Helpers
  - AuthService
    - `_loginAttempts: Dictionary<string username, int attempts>`
    - `TryLogin(LoginPlayload playload): bool`
    - `GenerateEncryptedPassword(string password): string`
    - `GenerateSessionToken(): SessionToken`
  - UnitOfWork
    - DbSet for each entity, excluding AUser

# API
* Reference to Business
* Endpoints
  - /notification-hub
  - /api/user
    - [POST] /
    - [GET, PUT, DELETE] /{userId}
    - /authenticate
      - [POST] /
      - [DELETE] /{userId}
  - /api/bookings
    - [POST] /
    - [GET, PUT, DELETE] /{bookingId}
  - /api/notes
    - [POST] /
    - [GET, PUT, DELETE] /{noteId}

# Test
* Reference to to DataAccess
  - Test for each repository

# Frontend
* `npx create-react-app . --template typescript`
* `npm install react-router-dom danholibraryrjs sass @microsoft/signalr`
* components
  - pages
    - _Page
    - Admin
    - Citizen
    - Login
    - NotFound
  - shared
    - Footer
    - Header
    - Input
    - Button
    - Modal
    - Router
* hooks
  - useRequestToCache
* models
  - /backend
    - Booking
    - Citizen
    - Login
    - Note
    - User
  - /frontend
    - LoginPayload
    - UserModifyPayload
    - NoteModifyPayload
    - BookingModifyPayload
* providers
  - AuthProvider
  - SignalRProvider
  - CitizenProvider
* styles
  - index.scss
  - _colors.scss
  - _mixins.scss
  - _animations.scss  
* tests
  - Test a few components to illustrate how to test components
* types
* utils
  - ApiUtil
* Constants.ts
  - Site name
  - Github link
  - Report links
  - Student name
  - Student education

# Hosted ends
* Host database on ITCN
* Host backend on Azure
* Host frontend on Netlify

# Finish reports


# Presentation


# Selfchosen topic
* Javascript over Typescript?