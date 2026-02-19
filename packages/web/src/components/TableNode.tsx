import { useDraggable } from '@dnd-kit/core';
import { GripVertical, Trash2 } from 'lucide-react';
import type { SchemaTable } from '@/types';

interface TableNodeProps {
  table: SchemaTable;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const fieldTypeColors: Record<string, string> = {
  string: 'bg-blue-500/20 text-blue-400',
  number: 'bg-green-500/20 text-green-400',
  boolean: 'bg-yellow-500/20 text-yellow-400',
  date: 'bg-purple-500/20 text-purple-400',
  email: 'bg-cyan-500/20 text-cyan-400',
  uuid: 'bg-pink-500/20 text-pink-400',
  phone: 'bg-orange-500/20 text-orange-400',
  address: 'bg-teal-500/20 text-teal-400',
  url: 'bg-indigo-500/20 text-indigo-400',
  custom: 'bg-neutral-500/20 text-neutral-400',
};

export function TableNode({ table, isSelected, onClick, onDelete }: TableNodeProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: table.id,
  });

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, left: table.position.x, top: table.position.y }}
      className={`absolute w-64 bg-neutral-900 border rounded-lg shadow-lg transition-shadow ${isSelected
          ? 'border-primary-600 ring-2 ring-primary-600/30'
          : 'border-neutral-700 hover:border-neutral-600'
        }`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div className="flex items-center justify-between px-3 py-2 bg-neutral-800 rounded-t-lg border-b border-neutral-700">
        <div className="flex items-center gap-2">
          <button
            className="cursor-grab active:cursor-grabbing text-neutral-500 hover:text-neutral-300"
            {...listeners}
            {...attributes}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <span className="font-medium text-sm">{table.name}</span>
        </div>
        <button
          className="text-neutral-500 hover:text-red-400 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-2 max-h-48 overflow-y-auto">
        {table.fields.length === 0 ? (
          <p className="text-xs text-neutral-600 text-center py-2">No fields yet</p>
        ) : (
          <div className="space-y-1">
            {table.fields.map((field) => (
              <div
                key={field.id}
                className="flex items-center justify-between px-2 py-1 rounded hover:bg-neutral-800/50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-300">{field.name}</span>
                  {field.required && <span className="text-red-400 text-xs">*</span>}
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${fieldTypeColors[field.type] || fieldTypeColors.custom}`}>
                  {field.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
