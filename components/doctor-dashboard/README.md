# Doctor Dashboard Components

## LiveTicketsStack Component

The `LiveTicketsStack` component displays incoming medical tickets that require doctor review in a stacked card format. This component is designed for the doctor dashboard to help medical professionals efficiently review and assign next steps to patient tickets.

### Features

- **Real-time Updates**: Uses Convex queries to fetch live data
- **Priority Sorting**: Tickets are sorted by symptom severity (severe → moderate → mild) and creation time
- **Stacked Visual Design**: Cards are visually stacked with slight offsets to create depth
- **Severity Indicators**: Color-coded borders and badges based on highest symptom severity
- **Patient Information**: Displays patient name, age, chief complaint, and symptoms
- **Action Buttons**: Quick access to review, assign next steps, and contact options
- **Empty State**: Friendly message when no tickets are pending review

### Data Source

The component fetches data using the `getIncomingTicketsForDoctors` Convex query, which returns:

- Medical tickets with status "in_progress"
- Tickets that have no next steps assigned (undefined nextSteps)
- Complete patient and profile information
- Sorted by creation time (newest first)

### Usage

```tsx
import { LiveTicketsStack } from "@/components/doctor-dashboard";

// In your page or component
<LiveTicketsStack className="optional-custom-classes" />;
```

### Integration

The component is integrated into:

- Main doctor dashboard page (`/doctor-dashboard`)
- Dedicated live tickets page (`/doctor-dashboard/live-tickets`)

### Related Convex Functions

- **Query**: `medicalTickets:getIncomingTicketsForDoctors` - Fetches incoming tickets
- **Mutation**: `medicalTickets:assignNextStepsToTicket` - Assigns next steps to tickets

### Styling

The component uses:

- Tailwind CSS for styling
- Shadcn UI components (Card, Badge, Button, etc.)
- Lucide React icons
- Color-coded severity indicators:
  - **Severe**: Red border and badges
  - **Moderate**: Yellow border and badges
  - **Mild**: Green border and badges

### Future Enhancements

- Click handlers for action buttons
- Modal dialogs for detailed ticket review
- Real-time notifications for new tickets
- Filtering and search capabilities
- Bulk actions for multiple tickets
