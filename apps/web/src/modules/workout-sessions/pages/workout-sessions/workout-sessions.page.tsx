import { PageLayout } from "@/web/components/layouts";
import { AppHeader, Calendar } from "@/web/components/ui";

import { WorkoutSessionDetails } from "./workout-session-details";
import { useWorkoutSessions } from "./workout-sessions.page.hook";

const WorkoutSessionPage = () => {
  const {
    // Data
    isLoading,
    selectedDate,
    eventDates,
    selectedDateSession,

    // Actions
    handleDateSelection,
  } = useWorkoutSessions();

  return (
    <>
      <AppHeader
        title="Workout Sessions"
        showBackButton={false}
        showActionButton={false}
      />
      <PageLayout
        meta={{ title: "Workout Sessions", description: "Workout Sessions" }}
        className="flex flex-col gap-8"
      >

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Calendar
              value={selectedDate}
              disabled={isLoading}
              selectionMode="single"
              eventDates={eventDates}
              onValueChanged={handleDateSelection}
            />
          </div>

          {/* Session Details Section */}
          <div>
            <WorkoutSessionDetails
              selectedDate={selectedDate}
              selectedDateSession={selectedDateSession}
              isLoading={isLoading}
            />
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default WorkoutSessionPage;
