import { Schema, SchemaRelation, SchemaField, TablePosition, SchemaTable, FieldType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../utils/storage';
import { generateFakerValue } from '../utils/faker';

const fieldTypeToFaker: Record<FieldType, string> = {
  string: 'word',
  number: 'number',
  boolean: 'boolean',
  date: 'date',
  email: 'email',
  uuid: 'uuid',
  phone: 'phone',
  address: 'street',
  url: 'url',
  custom: 'word',
};

export class SchemaModel {
  private schemas: Map<string, Schema> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = storage.getSchemas();
    stored.forEach(schema => {
      this.schemas.set(schema.id, schema);
    });
  }

  private persist(): void {
    storage.updateSchema(this.schemas.get(Array.from(this.schemas.keys())[0])?.id || '',
      Array.from(this.schemas.values())[0]);
    const allSchemas = Array.from(this.schemas.values());
    allSchemas.forEach(s => {
      storage.updateSchema(s.id, s);
    });
  }

  create(name: string): Schema {
    const id = uuidv4();
    const schema: Schema = {
      id,
      name,
      tables: [],
      relations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.schemas.set(id, schema);
    storage.addSchema(schema);
    return schema;
  }

  findAll(): Schema[] {
    return Array.from(this.schemas.values());
  }

  findById(id: string): Schema | undefined {
    return this.schemas.get(id);
  }

  update(id: string, updates: Partial<Schema>): Schema | null {
    const schema = this.schemas.get(id);
    if (!schema) return null;

    const updated: Schema = {
      ...schema,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.schemas.set(id, updated);
    storage.updateSchema(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    const deleted = this.schemas.delete(id);
    if (deleted) {
      storage.deleteSchema(id);
    }
    return deleted;
  }

  addTable(schemaId: string, name: string, position?: TablePosition): SchemaTable | null {
    const schema = this.schemas.get(schemaId);
    if (!schema) return null;

    const table: SchemaTable = {
      id: uuidv4(),
      name,
      fields: [],
      position: position || { x: 100 + schema.tables.length * 50, y: 100 + schema.tables.length * 50 },
    };
    schema.tables.push(table);
    schema.updatedAt = new Date().toISOString();
    this.schemas.set(schemaId, schema);
    storage.updateSchema(schemaId, schema);
    return table;
  }

  updateTable(schemaId: string, tableId: string, updates: Partial<SchemaTable>): SchemaTable | null {
    const schema = this.schemas.get(schemaId);
    if (!schema) return null;

    const tableIndex = schema.tables.findIndex(t => t.id === tableId);
    if (tableIndex === -1) return null;

    schema.tables[tableIndex] = { ...schema.tables[tableIndex], ...updates };
    schema.updatedAt = new Date().toISOString();
    this.schemas.set(schemaId, schema);
    storage.updateSchema(schemaId, schema);
    return schema.tables[tableIndex];
  }

  deleteTable(schemaId: string, tableId: string): boolean {
    const schema = this.schemas.get(schemaId);
    if (!schema) return false;

    schema.tables = schema.tables.filter(t => t.id !== tableId);
    schema.relations = schema.relations.filter(r => r.fromTable !== tableId && r.toTable !== tableId);
    schema.updatedAt = new Date().toISOString();
    this.schemas.set(schemaId, schema);
    storage.updateSchema(schemaId, schema);
    return true;
  }

  updateTablePosition(schemaId: string, tableId: string, position: TablePosition): boolean {
    const schema = this.schemas.get(schemaId);
    if (!schema) return false;

    const table = schema.tables.find(t => t.id === tableId);
    if (!table) return false;

    table.position = position;
    schema.updatedAt = new Date().toISOString();
    this.schemas.set(schemaId, schema);
    storage.updateTablePosition(schemaId, tableId, position);
    return true;
  }

  addField(schemaId: string, tableId: string, field: Omit<SchemaField, 'id'>): SchemaField | null {
    const schema = this.schemas.get(schemaId);
    if (!schema) return null;

    const table = schema.tables.find(t => t.id === tableId);
    if (!table) return null;

    const newField: SchemaField = { ...field, id: uuidv4() };
    table.fields.push(newField);
    schema.updatedAt = new Date().toISOString();
    this.schemas.set(schemaId, schema);
    storage.updateSchema(schemaId, schema);
    return newField;
  }

  updateField(schemaId: string, tableId: string, fieldId: string, updates: Partial<SchemaField>): SchemaField | null {
    const schema = this.schemas.get(schemaId);
    if (!schema) return null;

    const table = schema.tables.find(t => t.id === tableId);
    if (!table) return null;

    const fieldIndex = table.fields.findIndex(f => f.id === fieldId);
    if (fieldIndex === -1) return null;

    table.fields[fieldIndex] = { ...table.fields[fieldIndex], ...updates };
    schema.updatedAt = new Date().toISOString();
    this.schemas.set(schemaId, schema);
    storage.updateSchema(schemaId, schema);
    return table.fields[fieldIndex];
  }

  deleteField(schemaId: string, tableId: string, fieldId: string): boolean {
    const schema = this.schemas.get(schemaId);
    if (!schema) return false;

    const table = schema.tables.find(t => t.id === tableId);
    if (!table) return false;

    table.fields = table.fields.filter(f => f.id !== fieldId);
    schema.updatedAt = new Date().toISOString();
    this.schemas.set(schemaId, schema);
    storage.updateSchema(schemaId, schema);
    return true;
  }

  addRelation(schemaId: string, relation: Omit<SchemaRelation, 'id'>): SchemaRelation | null {
    const schema = this.schemas.get(schemaId);
    if (!schema) return null;

    const newRelation: SchemaRelation = { ...relation, id: uuidv4() };
    schema.relations.push(newRelation);
    schema.updatedAt = new Date().toISOString();
    this.schemas.set(schemaId, schema);
    storage.updateSchema(schemaId, schema);
    return newRelation;
  }

  updateRelation(schemaId: string, relationId: string, updates: Partial<SchemaRelation>): SchemaRelation | null {
    const schema = this.schemas.get(schemaId);
    if (!schema) return null;

    const relationIndex = schema.relations.findIndex(r => r.id === relationId);
    if (relationIndex === -1) return null;

    schema.relations[relationIndex] = { ...schema.relations[relationIndex], ...updates };
    schema.updatedAt = new Date().toISOString();
    this.schemas.set(schemaId, schema);
    storage.updateSchema(schemaId, schema);
    return schema.relations[relationIndex];
  }

  deleteRelation(schemaId: string, relationId: string): boolean {
    const schema = this.schemas.get(schemaId);
    if (!schema) return false;

    schema.relations = schema.relations.filter(r => r.id !== relationId);
    schema.updatedAt = new Date().toISOString();
    this.schemas.set(schemaId, schema);
    storage.updateSchema(schemaId, schema);
    return true;
  }

  generateFromTable(schemaId: string, tableId: string, count: number = 1): object[] {
    const schema = this.schemas.get(schemaId);
    if (!schema) return [];

    const table = schema.tables.find(t => t.id === tableId);
    if (!table || table.fields.length === 0) return [];

    const results: object[] = [];

    for (let i = 0; i < count; i++) {
      const row: Record<string, any> = {};

      for (const field of table.fields) {
        if (field.fakerTemplate) {
          const template = field.fakerTemplate.replace(/\{\{faker\.(\w+)\}\}/g, '$1');
          try {
            row[field.name] = generateFakerValue(template as any);
          } catch {
            row[field.name] = field.type === 'string' ? 'sample' : null;
          }
        } else {
          const fakerMethod = fieldTypeToFaker[field.type] || 'word';
          try {
            row[field.name] = generateFakerValue(fakerMethod as any);
          } catch {
            row[field.name] = field.type === 'string' ? 'sample' : null;
          }
        }
      }

      results.push(row);
    }

    return results;
  }
}

export const schemaModel = new SchemaModel();
