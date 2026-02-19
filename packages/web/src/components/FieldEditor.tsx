import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SchemaTable, SchemaField, FieldType } from '@/types';

interface FieldEditorProps {
  table: SchemaTable;
  tables: SchemaTable[];
  onClose: () => void;
  onAddField: (field: Omit<SchemaField, 'id'>) => void;
  onDeleteField: (fieldId: string) => void;
}

const fieldTypes: { value: FieldType; label: string }[] = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'date', label: 'Date' },
  { value: 'email', label: 'Email' },
  { value: 'uuid', label: 'UUID' },
  { value: 'phone', label: 'Phone' },
  { value: 'address', label: 'Address' },
  { value: 'url', label: 'URL' },
  { value: 'custom', label: 'Custom' },
];

const fakerTemplates = [
  { value: '', label: 'None' },
  { value: 'person.fullName', label: 'Full Name' },
  { value: 'person.firstName', label: 'First Name' },
  { value: 'person.lastName', label: 'Last Name' },
  { value: 'person.email', label: 'Email' },
  { value: 'person.phoneNumber', label: 'Phone' },
  { value: 'location.streetAddress', label: 'Street Address' },
  { value: 'location.city', label: 'City' },
  { value: 'location.country', label: 'Country' },
  { value: 'company.name', label: 'Company Name' },
  { value: 'commerce.productName', label: 'Product Name' },
  { value: 'commerce.price', label: 'Price' },
  { value: 'commerce.productDescription', label: 'Product Description' },
  { value: 'finance.accountNumber', label: 'Account Number' },
  { value: 'finance.amount', label: 'Amount' },
  { value: 'string.alpha', label: 'Alpha String' },
  { value: 'string.numeric', label: 'Numeric String' },
  { value: 'string.uuid', label: 'UUID' },
  { value: 'date.past', label: 'Past Date' },
  { value: 'date.future', label: 'Future Date' },
  { value: 'date.recent', label: 'Recent Date' },
  { value: 'internet.url', label: 'URL' },
  { value: 'internet.ipv4', label: 'IPv4' },
  { value: 'internet.ipv6', label: 'IPv6' },
  { value: 'image.url', label: 'Image URL' },
];

export function FieldEditor({ table, onClose, onAddField, onDeleteField }: FieldEditorProps) {
  const [newField, setNewField] = useState<Omit<SchemaField, 'id'>>({
    name: '',
    type: 'string',
    required: false,
    fakerTemplate: '',
  });

  const handleAdd = () => {
    if (!newField.name.trim()) return;
    onAddField(newField);
    setNewField({ name: '', type: 'string', required: false, fakerTemplate: '' });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-neutral-900 border-l border-neutral-800 shadow-2xl z-40 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
        <div>
          <h3 className="font-semibold">{table.name}</h3>
          <p className="text-xs text-neutral-500">Manage fields</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-3 p-3 bg-neutral-800/50 rounded-lg border border-neutral-800">
          <p className="text-sm font-medium text-neutral-400">Add New Field</p>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Field name"
              value={newField.name}
              onChange={(e) => setNewField({ ...newField, name: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
            <select
              value={newField.type}
              onChange={(e) => setNewField({ ...newField, type: e.target.value as FieldType })}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
            >
              {fieldTypes.map((ft) => (
                <option key={ft.value} value={ft.value}>{ft.label}</option>
              ))}
            </select>
            <select
              value={newField.fakerTemplate || ''}
              onChange={(e) => setNewField({ ...newField, fakerTemplate: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
            >
              {fakerTemplates.map((ft) => (
                <option key={ft.value} value={ft.value}>{ft.label}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-neutral-400">
              <input
                type="checkbox"
                checked={newField.required}
                onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                className="rounded border-neutral-700 bg-neutral-950 text-primary-600 focus:ring-primary-600"
              />
              Required
            </label>
            <Button onClick={handleAdd} disabled={!newField.name.trim()} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-400">Existing Fields ({table.fields.length})</p>
          {table.fields.length === 0 ? (
            <p className="text-sm text-neutral-600 text-center py-4">No fields yet</p>
          ) : (
            <div className="space-y-2">
              {table.fields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg border border-neutral-800"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{field.name}</span>
                      {field.required && <span className="text-red-400 text-xs">*</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-1.5 py-0.5 bg-neutral-700 rounded text-neutral-400">
                        {field.type}
                      </span>
                      {field.fakerTemplate && (
                        <span className="text-xs text-neutral-500 truncate">{field.fakerTemplate}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-neutral-500 hover:text-red-400"
                    onClick={() => onDeleteField(field.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
