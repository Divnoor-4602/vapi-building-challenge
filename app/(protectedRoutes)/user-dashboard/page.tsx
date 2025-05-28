import { getAllAssistants } from "@/lib/actions/vapi.action";
import React from "react";

export default async function DashboardPage() {
  const assistants = await getAllAssistants();

  console.log(assistants);

  return <div className="flex flex-1 flex-col gap-6 p-6"></div>;
}
