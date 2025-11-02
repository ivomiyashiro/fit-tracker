import { useNavigate } from "@tanstack/react-router";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";

import { Button } from "@/web/components/ui";

type ActionButtonProps = {
  actionButtonComponent?: React.ReactNode;
  onActionButtonClick?: () => void;
};

const ActionButton = ({ actionButtonComponent, onActionButtonClick }: ActionButtonProps) => {
  if (actionButtonComponent) {
    return actionButtonComponent;
  }

  return (
    <Button variant="ghost" className="w-8 h-8" onClick={() => onActionButtonClick?.()}>
      <MoreVerticalIcon />
    </Button>
  );
};

type Props = {
  onBackButtonClick?: () => void;
  onActionButtonClick?: () => void;
  actionButtonComponent?: React.ReactNode;
  showBackButton?: boolean;
  showActionButton?: boolean;
  title: string | React.ReactNode;
};

export const AppHeader = ({
  onBackButtonClick,
  onActionButtonClick,
  actionButtonComponent,
  showBackButton,
  showActionButton,
  title,
}: Props) => {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    if (onBackButtonClick) {
      return onBackButtonClick();
    }

    try {
      window.history.back();
    }
    catch {
      navigate({ to: "/" });
    }
  };

  return (
    <header className="border-b border-border border-r border-l mx-4 sm:max-w-md rounded-b-lg px-4 sm:mx-auto">
      <div className="relative flex items-center justify-center p-4 sm:px-0 sm:max-w-md sm:mx-auto">
        {showBackButton && (
          <div className="absolute left-0">
            <Button variant="secondary" className="w-8 h-8" onClick={handleBackButtonClick}>
              <ArrowLeftIcon />
            </Button>
          </div>
        )}

        <h1 className="text-xl font-bold">{title}</h1>

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
