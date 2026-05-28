import { PencilSimple, Trash, Eye } from "@phosphor-icons/react";

export function RowActions({
  onEdit,
  onDelete,
  onView,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}) {
  return (
    <div className="flex gap-1 justify-end">
      {onView && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          className="w-8 h-8 flex items-center justify-center bg-surface-3 border border-border text-blue hover:bg-blue hover:text-white transition-colors"
        >
          <Eye weight="bold" size={14} />
        </button>
      )}
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="w-8 h-8 flex items-center justify-center bg-surface-3 border border-border text-teal hover:bg-teal hover:text-white transition-colors"
        >
          <PencilSimple weight="bold" size={14} />
        </button>
      )}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="w-8 h-8 flex items-center justify-center bg-surface-3 border border-border text-red-500 hover:bg-red-500 hover:text-white transition-colors"
        >
          <Trash weight="bold" size={14} />
        </button>
      )}
    </div>
  );
}
