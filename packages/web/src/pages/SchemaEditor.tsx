import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import {
  ArrowLeft,
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Link as LinkIcon,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { TableNode } from '@/components/TableNode';
import { FieldEditor } from '@/components/FieldEditor';
import { RelationshipEditor } from '@/components/RelationshipEditor';
import { schemasApi } from '@/services/api';
import { toastError, toastSuccess } from '@/lib/toast';
import type { Schema, SchemaTable, SchemaField, SchemaRelation } from '@/types';
import { Toaster } from '@/components/ui/toaster';

export function SchemaEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [schema, setSchema] = useState<Schema | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverConnected, setServerConnected] = useState(true);
  const [selectedTable, setSelectedTable] = useState<SchemaTable | null>(null);
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [showRelationEditor, setShowRelationEditor] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const fetchSchema = useCallback(async () => {
    if (!id) return;
    try {
      const data = await schemasApi.getById(id);
      setSchema(data);
      if (!serverConnected) setServerConnected(true);
    } catch (err) {
      console.error('Failed to fetch schema:', err);
      if (serverConnected) setServerConnected(false);
      toastError('Server disconnected', 'Unable to connect to mock server');
    } finally {
      setLoading(false);
    }
  }, [id, serverConnected]);

  useEffect(() => {
    fetchSchema();
  }, [fetchSchema]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, delta } = event;
    setActiveId(null);

    if (!schema || !delta.x && !delta.y) return;

    const tableId = active.id as string;
    const table = schema.tables.find(t => t.id === tableId);
    if (!table) return;

    const newPosition = {
      x: table.position.x + delta.x / zoom,
      y: table.position.y + delta.y / zoom,
    };

    try {
      await schemasApi.updateTablePosition(schema.id, tableId, newPosition);
      setSchema(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          tables: prev.tables.map(t =>
            t.id === tableId ? { ...t, position: newPosition } : t
          ),
        };
      });
    } catch (err) {
      console.error('Failed to update table position:', err);
      toastError('Failed to save', 'Could not update table position');
    }
  };

  const handleAddTable = async () => {
    if (!schema) return;
    const name = prompt('Enter table name:');
    if (!name?.trim()) return;

    try {
      const position = {
        x: 100 + Math.random() * 200,
        y: 100 + Math.random() * 200,
      };
      const table = await schemasApi.addTable(schema.id, name.trim(), position);
      setSchema(prev => prev ? { ...prev, tables: [...prev.tables, table] } : prev);
      toastSuccess('Table added', `Created "${name}" table`);
    } catch (err) {
      console.error('Failed to add table:', err);
      toastError('Failed to add table', 'Please try again');
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    if (!schema) return;
    const table = schema.tables.find(t => t.id === tableId);
    if (!confirm(`Delete table "${table?.name}"?`)) return;

    try {
      await schemasApi.deleteTable(schema.id, tableId);
      setSchema(prev => prev ? {
        ...prev,
        tables: prev.tables.filter(t => t.id !== tableId),
        relations: prev.relations.filter(r => r.fromTable !== tableId && r.toTable !== tableId),
      } : prev);
      if (selectedTable?.id === tableId) {
        setSelectedTable(null);
        setShowFieldEditor(false);
      }
      toastSuccess('Table deleted', 'Table removed successfully');
    } catch (err) {
      console.error('Failed to delete table:', err);
      toastError('Failed to delete table', 'Please try again');
    }
  };

  const handleAddField = async (field: Omit<SchemaField, 'id'>) => {
    if (!schema || !selectedTable) return;
    try {
      const newField = await schemasApi.addField(schema.id, selectedTable.id, field);
      setSchema(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          tables: prev.tables.map(t =>
            t.id === selectedTable.id
              ? { ...t, fields: [...t.fields, newField] }
              : t
          ),
        };
      });
      setSelectedTable(prev => prev ? { ...prev, fields: [...prev.fields, newField] } : null);
    } catch (err) {
      console.error('Failed to add field:', err);
      toastError('Failed to add field', 'Please try again');
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!schema || !selectedTable) return;
    try {
      await schemasApi.deleteField(schema.id, selectedTable.id, fieldId);
      setSchema(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          tables: prev.tables.map(t =>
            t.id === selectedTable.id
              ? { ...t, fields: t.fields.filter(f => f.id !== fieldId) }
              : t
          ),
        };
      });
      setSelectedTable(prev => prev ? {
        ...prev,
        fields: prev.fields.filter(f => f.id !== fieldId),
      } : null);
    } catch (err) {
      console.error('Failed to delete field:', err);
      toastError('Failed to delete field', 'Please try again');
    }
  };

  const handleAddRelation = async (relation: Omit<SchemaRelation, 'id'>) => {
    if (!schema) return;
    try {
      const newRelation = await schemasApi.addRelation(schema.id, relation);
      setSchema(prev => prev ? { ...prev, relations: [...prev.relations, newRelation] } : prev);
      toastSuccess('Relation created', 'Relationship added successfully');
    } catch (err) {
      console.error('Failed to add relation:', err);
      toastError('Failed to add relation', 'Please try again');
    }
  };

  const handleDeleteRelation = async (relationId: string) => {
    if (!schema) return;
    try {
      await schemasApi.deleteRelation(schema.id, relationId);
      setSchema(prev => prev ? {
        ...prev,
        relations: prev.relations.filter(r => r.id !== relationId),
      } : prev);
      toastSuccess('Relation deleted', 'Relationship removed successfully');
    } catch (err) {
      console.error('Failed to delete relation:', err);
      toastError('Failed to delete relation', 'Please try again');
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.min(Math.max(prev + delta, 0.25), 2));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const activeTable = schema?.tables.find(t => t.id === activeId);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Header serverConnected={serverConnected} />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <Header serverConnected={serverConnected} />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <p className="text-neutral-500 mb-4">Schema not found</p>
            <Button variant="outline" onClick={() => navigate('/schemas')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Schemas
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Header serverConnected={serverConnected} />
      
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/schemas')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="font-semibold">{schema.name}</h2>
            <p className="text-xs text-neutral-500">
              {schema.tables.length} tables, {schema.relations.length} relations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowRelationEditor(true)}>
            <LinkIcon className="h-4 w-4 mr-2" />
            Relations
          </Button>
          <Button variant="outline" size="sm" onClick={handleAddTable}>
            <Plus className="h-4 w-4 mr-2" />
            Add Table
          </Button>
          <div className="flex items-center gap-1 ml-4 border-l border-neutral-700 pl-4">
            <Button variant="ghost" size="icon" onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.25))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs text-neutral-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="icon" onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative" style={{ cursor: isPanning ? 'grabbing' : 'default' }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #262626 1px, transparent 1px)',
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div
            className="absolute"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            {schema.tables.map((table) => (
              <TableNode
                key={table.id}
                table={table}
                isSelected={selectedTable?.id === table.id}
                onClick={() => {
                  setSelectedTable(table);
                  setShowFieldEditor(true);
                }}
                onDelete={() => handleDeleteTable(table.id)}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTable ? (
              <div className="opacity-80">
                <TableNode
                  table={activeTable}
                  isSelected={false}
                  onClick={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {showFieldEditor && selectedTable && (
        <FieldEditor
          table={selectedTable}
          tables={schema.tables}
          onClose={() => {
            setShowFieldEditor(false);
            setSelectedTable(null);
          }}
          onAddField={handleAddField}
          onDeleteField={handleDeleteField}
        />
      )}

      {showRelationEditor && (
        <RelationshipEditor
          schema={schema}
          onClose={() => setShowRelationEditor(false)}
          onAddRelation={handleAddRelation}
          onDeleteRelation={handleDeleteRelation}
        />
      )}

      <Toaster />
    </div>
  );
}
