import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toastError } from '@/lib/toast';
import type { Schema, SchemaRelation, RelationType } from '@/types';

interface RelationshipEditorProps {
  schema: Schema;
  onClose: () => void;
  onAddRelation: (relation: Omit<SchemaRelation, 'id'>) => void;
  onDeleteRelation: (relationId: string) => void;
}

const relationTypes: { value: RelationType; label: string; description: string }[] = [
  { value: 'one-to-one', label: 'One to One', description: 'Each record relates to one record' },
  { value: 'one-to-many', label: 'One to Many', description: 'One record relates to many records' },
  { value: 'many-to-many', label: 'Many to Many', description: 'Records relate to many records' },
];

export function RelationshipEditor({ schema, onClose, onAddRelation, onDeleteRelation }: RelationshipEditorProps) {
  const [newRelation, setNewRelation] = useState<Omit<SchemaRelation, 'id'>>({
    fromTable: '',
    toTable: '',
    type: 'one-to-many',
  });

  const handleAdd = () => {
    if (!newRelation.fromTable || !newRelation.toTable) return;
    if (newRelation.fromTable === newRelation.toTable) {
      toastError('Invalid relation', 'Cannot create relation to the same table');
      return;
    }
    onAddRelation(newRelation);
    setNewRelation({ fromTable: '', toTable: '', type: 'one-to-many' });
  };

  const getTableName = (tableId: string) => {
    const table = schema.tables.find(t => t.id === tableId);
    return table?.name || tableId;
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-neutral-900 border-l border-neutral-800 shadow-2xl z-40 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
        <div>
          <h3 className="font-semibold">Relationships</h3>
          <p className="text-xs text-neutral-500">Define table relations</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {schema.tables.length < 2 ? (
          <div className="text-center py-8">
            <p className="text-sm text-neutral-500">You need at least 2 tables to create relationships</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 p-3 bg-neutral-800/50 rounded-lg border border-neutral-800">
              <p className="text-sm font-medium text-neutral-400">Add New Relation</p>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">From Table</label>
                  <select
                    value={newRelation.fromTable}
                    onChange={(e) => setNewRelation({ ...newRelation, fromTable: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="">Select table...</option>
                    {schema.tables.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Relation Type</label>
                  <select
                    value={newRelation.type}
                    onChange={(e) => setNewRelation({ ...newRelation, type: e.target.value as RelationType })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    {relationTypes.map((rt) => (
                      <option key={rt.value} value={rt.value}>{rt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">To Table</label>
                  <select
                    value={newRelation.toTable}
                    onChange={(e) => setNewRelation({ ...newRelation, toTable: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="">Select table...</option>
                    {schema.tables
                      .filter((t) => t.id !== newRelation.fromTable)
                      .map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                  </select>
                </div>
                <Button onClick={handleAdd} disabled={!newRelation.fromTable || !newRelation.toTable} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Relation
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-400">Existing Relations ({schema.relations.length})</p>
              {schema.relations.length === 0 ? (
                <p className="text-sm text-neutral-600 text-center py-4">No relations yet</p>
              ) : (
                <div className="space-y-2">
                  {schema.relations.map((relation) => (
                    <div
                      key={relation.id}
                      className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg border border-neutral-800"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{getTableName(relation.fromTable)}</span>
                          <span className="text-xs text-neutral-500">→</span>
                          <span className="text-sm text-neutral-400">{getTableName(relation.toTable)}</span>
                        </div>
                        <span className="text-xs px-1.5 py-0.5 bg-neutral-700 rounded text-neutral-400 mt-1 inline-block">
                          {relation.type}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-neutral-500 hover:text-red-400"
                        onClick={() => onDeleteRelation(relation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
