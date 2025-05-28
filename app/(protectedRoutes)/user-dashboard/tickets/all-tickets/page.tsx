import { AllTicketsTable } from "@/components/user-dashboard/tickets/all-tickets-table";

export default function AllTicketsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold">All Medical Tickets</h1>
            <p className="text-muted-foreground mt-2">
              Complete overview of all your medical consultation tickets
            </p>
          </div>
        </div>

        {/* All Tickets Table */}
        <AllTicketsTable />
      </div>
    </div>
  );
}
