import { useNavigate } from "@tanstack/react-router";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";

import { Button } from "@/web/components/ui";

const ActionButton = ({
  actionButtonComponent,
  onActionButtonClick,
}: {
  actionButtonComponent?: React.ReactNode;
  onActionButtonClick?: () => void;
}) => {
  if (actionButtonComponent) {
    return actionButtonComponent;
  }

  return (
    <Button variant="ghost" className="w-9 h-9" onClick={() => onActionButtonClick?.()}>
      <MoreVerticalIcon />
    </Button>
  );
};

export const AppHeader = ({
  onBackButtonClick,
  onActionButtonClick,
  actionButtonComponent,
  showBackButton,
  showActionButton,
  title,
}: {
  onBackButtonClick?: () => void;
  onActionButtonClick?: () => void;
  actionButtonComponent?: React.ReactNode;
  showBackButton?: boolean;
  showActionButton?: boolean;
  title: string;
}) => {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    if (onBackButtonClick) {
      onBackButtonClick();
    }
    else {
      navigate({ to: "/" });
    }
  };

  return (
    <header className="border-b border-border border-r border-l mx-4 sm:max-w-md rounded-b-lg px-4 sm:mx-auto">
      <div className="relative flex items-center justify-center p-4 sm:px-0 sm:max-w-md sm:mx-auto">
        {showBackButton && (
          <div className="absolute left-0">
            <Button variant="secondary" className="w-9 h-9" onClick={handleBackButtonClick}>
              <ArrowLeftIcon />
            </Button>
          </div>
        )}

        <h1 className="text-2xl font-bold">{title}</h1>

        {showActionButton && (
          <div className="absolute right-0">
            <ActionButton
              actionButtonComponent={actionButtonComponent}
              onActionButtonClick={onActionButtonClick}
            />
          </div>
        )}
      </div>
    </header>
  );
};
