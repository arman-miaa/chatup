/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Ticket } from "lucide-react";

export default function EventCard({ event }: any) {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardContent className="p-6">
        <div className="mb-6">
          <span className="inline-block rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
            Feb 10, 2025
          </span>
        </div>

        <h2 className="text-2xl font-semibold mb-2">
          Digital Disruptors Summit
        </h2>
        <p className="text-gray-500 mb-6">
          Where disruptive minds meet to create tomorrow&apos;s digital world
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Clock className="h-4 w-4" />
            <span>5:00 pm – 10:00 am</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <MapPin className="h-4 w-4" />
            <span>Exploratorium Pier 15, San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Ticket className="h-4 w-4" />
            <span>$299 | Free for Members</span>
          </div>
        </div>

        <Button className="rounded-full px-6 py-5 bg-purple-200 text-purple-900 hover:bg-purple-300">
          Event Details
        </Button>
      </CardContent>
    </Card>
  );
}
