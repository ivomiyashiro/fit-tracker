import type { WorkoutSession } from "@/web/modules/workouts/types";

type WorkoutSessionDetailsProps = {
  selectedDate: Date;
  selectedDateSession: WorkoutSession | undefined;
  isLoading: boolean;
};

export function WorkoutSessionDetails({
  selectedDate,
  selectedDateSession,
  isLoading,
}: WorkoutSessionDetailsProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Cargando detalles...</p>
      </div>
    );
  }

  if (!selectedDateSession) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No hay sesión de entrenamiento para esta fecha
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="ml-4 font-semibold">
        {selectedDate.toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </h2>

      <div className="bg-card rounded-lg p-4 space-y-3 border border-border">
        <div>
          <p className="text-sm text-muted-foreground">ID Sesión</p>
          <p className="font-semibold">{selectedDateSession.id}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Workout ID</p>
          <p className="font-semibold">{selectedDateSession.workoutId}</p>
        </div>

        {selectedDateSession.duration && (
          <div>
            <p className="text-sm text-muted-foreground">Duración</p>
            <p className="font-semibold">
              {selectedDateSession.duration}
              {" "}
              minutos
            </p>
          </div>
        )}

        {selectedDateSession.notes && (
          <div>
            <p className="text-sm text-muted-foreground">Notas</p>
            <p className="text-sm">{selectedDateSession.notes}</p>
          </div>
        )}

        <div>
          <p className="text-sm text-muted-foreground">Completado</p>
          <p className="text-sm">
            {new Date(selectedDateSession.completedAt!).toLocaleString("es-ES")}
          </p>
        </div>
      </div>
    </div>
  );
}
