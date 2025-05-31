## 🛠️ Available Modals

### Current Implementations

1. **BookAppointmentModal** - Schedule medical appointments

   - Environment: `NEXT_PUBLIC_VAPI_APPOINTMENT_ASSISTANT_ID`
   - Features: Doctor assignment, calendar integration, appointment polling

2. **RequestPrescriptionModal** - Unified medical consultation

   - Environment: `NEXT_PUBLIC_VAPI_UNIFIED_ASSISTANT_ID`
   - Features: Unified assistant (Lakshay), handles both prescription and appointment flows
   - Workflow: Patient intake → Medical team review → Intelligent routing (prescription OR appointment)
   - Success detection: Polls for prescription/appointment creation during calls

### Planned Implementations

- Customer Support Modal
- Medical Records Update Modal
- Insurance Verification Modal
- Telehealth Consultation Modal
