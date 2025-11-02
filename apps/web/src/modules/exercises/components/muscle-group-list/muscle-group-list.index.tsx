import type { SelectionChangedEvent } from "@/web/components/ui/list/list.types";
import type { MuscleGroup } from "@/web/modules/exercises/types";

import { useMemo, useState } from "react";

import { List } from "@/web/components/ui";
import { useDebounce } from "@/web/hooks";
import { useMuscleGroupsQuery } from "@/web/modules/exercises/hooks/queries";

import { MuscleGroupListItemTemplate } from "./muscle-group-list-item-template";

type MuscleGroupSelectionListProps = {
  searchPlaceholder?: string;
  selectedMuscleGroups?: MuscleGroup[];
  onSelectionChanged?: (muscleGroups: MuscleGroup[]) => void;
  selectionEnabled?: boolean;
};

export const MuscleGroupSelectionList = ({
  searchPlaceholder = "Search muscle groups...",
  selectedMuscleGroups = [],
  onSelectionChanged,
  selectionEnabled = true,
}: MuscleGroupSelectionListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: muscleGroups = [], isError, isSuccess } = useMuscleGroupsQuery();

  // Filter muscle groups based on search term
  const filteredMuscleGroups = useMemo(() => {
    if (!debouncedSearchTerm)
return muscleGroups;
    return muscleGroups.filter((mg: MuscleGroup) =>
      mg.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    );
  }, [muscleGroups, debouncedSearchTerm]);

  const selectedIds = useMemo(
    () => selectedMuscleGroups?.map(mg => mg.id) || [],
    [selectedMuscleGroups],
  );

  const handleSelectionChanged = (e: SelectionChangedEvent<MuscleGroup>) => {
    onSelectionChanged?.(e.selectedItems);
  };

  if (isError) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold mb-2">Error loading muscle groups</h3>
        <p className="text-muted-foreground">There was an error loading muscle groups. Please try again.</p>
      </div>
    );
  }

  return (
    <List
      dataSource={filteredMuscleGroups}
      displayExpr="name"
      height="300px"
      isSuccess={isSuccess}
      keyExpr="id"
      noDataText={searchTerm ? `No muscle groups match "${searchTerm}". Try a different search term.` : "No muscle groups available."}
      onSearchValueChanged={setSearchTerm}
      onSelectionChanged={handleSelectionChanged}
      searchEnabled={true}
      searchPlaceholder={searchPlaceholder}
      searchValue={searchTerm}
      selectByClick={selectionEnabled}
      selectedItems={selectedMuscleGroups}
      selectedItemKeys={selectedIds}
      selectionMode={selectionEnabled ? "multiple" : "none"}
      showSelectionControls={selectionEnabled}
      itemTemplate={({ itemData: muscleGroup }) => (
        <MuscleGroupListItemTemplate
          muscleGroup={muscleGroup}
          selectionEnabled={selectionEnabled}
        />
      )}
    />
  );
};
