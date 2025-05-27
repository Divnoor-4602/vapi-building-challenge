# Patient Intake Flow - Decision Tree Flowchart

```mermaid
flowchart TD
    A[Call Starts] --> B[Greet Patient & Ask for Pronouns]

    B --> C{Patient Email Provided?}
    C -->|No| D[Collect Email Address]
    C -->|Yes| E[Use Provided Email]
    D --> D1[Repeat Email Back for Confirmation]
    D1 --> D2{Email Correct?}
    D2 -->|Yes| E
    D2 -->|No| D3[Ask User to Spell Email Again]
    D3 --> D1

    E --> F[Check Patient Profile & Store User/Profile IDs]
    F --> G{Profile Exists?}

    G -->|No| H[Profile Creation Flow]
    G -->|Yes| I{Profile Complete?}

    I -->|Yes| J[Review Existing Info]
    I -->|No| K[Get Missing Fields]

    K --> L{Patient Wants to Complete Profile?}
    L -->|Yes| M[Collect Missing Fields Only]
    L -->|No| N[Skip Profile Update]

    M --> O[Update Patient Profile]
    O --> PR[Patient Registration Flow]
    N --> PR
    J --> PR

    H --> H1[Collect Basic Demographics]
    H1 --> H2[Collect Contact Information]
    H2 --> H3[Collect Communication Preferences]
    H3 --> H4[Collect Emergency Contact - Optional]
    H4 --> H5[Create Patient Profile]
    H5 --> PR

    PR --> PR1[Collect Medical History - Allergies]
    PR1 --> PR2[Collect Current Medications]
    PR2 --> PR3[Collect Chronic Conditions]
    PR3 --> PR4[Collect Previous Surgeries]
    PR4 --> PR5[Collect Family History - Optional]
    PR5 --> PR6{Want to Provide Insurance?}
    PR6 -->|Yes| PR7[Collect Insurance Information]
    PR6 -->|No| PR8[Skip Insurance]
    PR7 --> PR9[Collect Consents]
    PR8 --> PR9
    PR9 --> PR10[Confirm Patient Information]
    PR10 --> PR11{Information Correct?}
    PR11 -->|Yes| PR12[Create Patient Record]
    PR11 -->|No| PR13[Make Corrections]
    PR13 --> PR10
    PR12 --> P[Symptom Collection]

    P --> P1[Collect Chief Complaint]
    P1 --> P2[Gather Symptom Details]
    P2 --> P3[Ask About Medications]
    P3 --> P4[Collect Additional Symptoms]
    P4 --> P5[Review Medical History]
    P5 --> P6[Assess Urgency Level]

    P6 --> Q{Emergency Symptoms?}
    Q -->|Yes| R[Advise Emergency Care/911]
    Q -->|No| S[Create Medical Ticket]

    S --> T[Explain Triage Process]
    T --> U[Monitor Ticket Status]
    U --> V{Ticket Status?}

    V -->|Doctor Needed| W[Transfer to Appointment Booking]
    V -->|Pharmacist Needed| X[Transfer to Pharmacist]
    V -->|Still Processing| Y[Provide Update]
    Y --> U

    W --> Z[Call Complete]
    X --> Z
    R --> Z

    style A fill:#e1f5fe
    style Z fill:#c8e6c9
    style R fill:#ffcdd2
    style Q fill:#fff3e0
    style G fill:#f3e5f5
    style I fill:#f3e5f5
    style L fill:#f3e5f5
    style V fill:#f3e5f5
    style D2 fill:#e8f5e8
    style PR6 fill:#f3e5f5
    style PR11 fill:#e8f5e8
    style PR fill:#fff8e1
    style PR1 fill:#fff8e1
    style PR2 fill:#fff8e1
    style PR3 fill:#fff8e1
    style PR4 fill:#fff8e1
    style PR5 fill:#fff8e1
    style PR7 fill:#fff8e1
    style PR8 fill:#fff8e1
    style PR9 fill:#fff8e1
    style PR10 fill:#fff8e1
    style PR12 fill:#fff8e1
    style PR13 fill:#fff8e1
```

## Decision Points Breakdown

### 1. **Email Collection Decision**

- **Condition**: Is {{patientEmail}} provided?
- **Actions**:
  - If No → Collect email from patient
  - If Yes → Use provided email

### 1a. **Email Confirmation Decision**

- **Condition**: Is the collected email address correct?
- **Actions**:
  - If Yes → Proceed with profile verification
  - If No → Ask user to spell email again and repeat confirmation

### 2. **Profile Existence Decision**

- **Condition**: Does profile exist in system?
- **Actions**:
  - If No → Start profile creation flow
  - If Yes → Check if profile is complete
- **Note**: Store user ID and profile ID for patient registration

### 3. **Profile Completeness Decision**

- **Condition**: Is existing profile complete?
- **Actions**:
  - If Complete → Review info and proceed to patient registration
  - If Incomplete → Check what fields are missing

### 4. **Profile Update Consent Decision**

- **Condition**: Does patient want to complete missing profile info?
- **Actions**:
  - If Yes → Collect only missing fields
  - If No → Skip to patient registration

### 5. **Patient Registration Flow** (New)

- **Sequential Steps**:
  1. Collect medical history (allergies, medications, chronic conditions, surgeries)
  2. Collect family history (optional)
  3. Ask about insurance information
  4. Collect required consents
  5. Confirm all information
  6. Create patient record

### 6. **Insurance Information Decision** (New)

- **Condition**: Does patient want to provide insurance now?
- **Actions**:
  - If Yes → Collect insurance details
  - If No → Skip insurance (can be added later)

### 7. **Patient Information Confirmation Decision** (New)

- **Condition**: Is all patient information correct?
- **Actions**:
  - If Yes → Create patient record and proceed to symptoms
  - If No → Allow corrections and re-confirm

### 8. **Emergency Assessment Decision**

- **Condition**: Are symptoms indicating emergency?
- **Actions**:
  - If Yes → Advise emergency care/911
  - If No → Continue with normal triage

### 9. **Triage Result Decision**

- **Condition**: What does medical team recommend?
- **Actions**:
  - Doctor needed → Transfer to appointment booking
  - Pharmacist needed → Transfer to pharmacist
  - Still processing → Provide update and wait

## Key Tools Used at Each Stage

| Stage                    | Tools Required                                         |
| ------------------------ | ------------------------------------------------------ |
| Profile Verification     | `checkPatientProfile`                                  |
| Profile Creation         | `createPatientProfile`                                 |
| Profile Update           | `getProfileMissingFields`, `updatePatientProfile`      |
| **Patient Registration** | **`createPatient`**                                    |
| Medical Intake           | `createMedicalTicket`                                  |
| Monitoring               | `checkTicketStatus`                                    |
| Transfer                 | `transferToAppointmentBooking`, `transferToPharmacist` |

## Data Collection Requirements

### Required for New Profiles:

- firstName, lastName
- dateOfBirth
- phoneNumber
- email (already provided)
- address (street required, city/state/zip optional)
- communicationPreferences

### Optional for New Profiles:

- gender
- emergencyContact

### **Required for Patient Registration:** (New)

- **userId, profileId** (from profile verification)
- **Medical History**:
  - allergies (array, empty if none)
  - currentMedications (array with name/dosage/frequency, empty if none)
  - chronicConditions (array, empty if none)
  - previousSurgeries (array with procedure/year, empty if none)
  - familyHistory (optional array)
- **Consents** (all required except marketing):
  - treatmentConsent (must be true)
  - dataProcessingConsent (must be true)
  - marketingConsent (optional)
- **Insurance** (optional but complete if provided):
  - provider, policyNumber, subscriberName, relationshipToSubscriber
  - groupNumber (optional within insurance)

### Required for Medical Tickets:

- chiefComplaint
- symptomDetails
- currentMedications
- additionalSymptoms
- urgencyLevel
- medicalHistoryRelevant
