import { useState } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fakerTemplates = [
  { label: 'Name', value: '{{faker.name}}' },
  { label: 'First Name', value: '{{faker.firstName}}' },
  { label: 'Last Name', value: '{{faker.lastName}}' },
  { label: 'Email', value: '{{faker.email}}' },
  { label: 'Phone', value: '{{faker.phone}}' },
  { label: 'UUID', value: '{{faker.uuid}}' },
  { label: 'Boolean', value: '{{faker.boolean}}' },
  { label: 'Number', value: '{{faker.number}}' },
  { label: 'Date', value: '{{faker.date}}' },
  { label: 'City', value: '{{faker.city}}' },
  { label: 'Country', value: '{{faker.country}}' },
  { label: 'Street', value: '{{faker.street}}' },
  { label: 'URL', value: '{{faker.url}}' },
  { label: 'Avatar', value: '{{faker.avatar}}' },
  { label: 'Company', value: '{{faker.company}}' },
  { label: 'Word', value: '{{faker.word}}' },
  { label: 'Sentence', value: '{{faker.sentence}}' },
];

export function FakerTemplates({ onInsert }: { onInsert: (template: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="h-6 gap-1 text-xs text-neutral-400 hover:text-primary-400"
        onClick={() => setOpen(!open)}
      >
        <Sparkles className="h-3 w-3" />
        Faker
        <ChevronDown className="h-3 w-3" />
      </Button>
      
      {open && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setOpen(false)} 
          />
          <div className="absolute right-0 top-full mt-1 z-50 w-48 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg py-1 max-h-60 overflow-auto">
            {fakerTemplates.map((template) => (
              <button
                key={template.value}
                className="w-full text-left px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700 hover:text-primary-400"
                onClick={() => {
                  onInsert(template.value);
                  setOpen(false);
                }}
              >
                {template.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
