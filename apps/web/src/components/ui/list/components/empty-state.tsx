type EmptyStateProps = {
  noDataText: string;
};

export function EmptyState({ noDataText }: EmptyStateProps) {
  return (
    <div className="p-4 text-center text-muted-foreground pt-12">
      <p className="text-sm">
        {noDataText}
      </p>
    </div>
  );
}
