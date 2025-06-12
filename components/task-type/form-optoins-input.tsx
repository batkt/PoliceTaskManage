import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus, Trash2 } from 'lucide-react';

const FormOptionsInput = ({
  value = [],
  onChange,
}: {
  value?: string[];
  onChange?: (value: string[]) => void;
}) => {
  return (
    <div className="mt-4">
      <Label className="mb-2 block">Сонгох утгууд</Label>
      <div className="space-y-2">
        {value?.map((option, optionIndex) => (
          <div key={optionIndex} className="flex items-center gap-2">
            <Input
              value={option}
              onChange={(e) => {
                const newOptions = [...(value || [])];
                newOptions[optionIndex] = e.target.value;
                onChange?.(newOptions);
              }}
              placeholder={`Option ${optionIndex + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const newOptions =
                  value?.filter((_, i) => i !== optionIndex) || [];
                onChange?.(newOptions);
              }}
              disabled={value?.length === 1}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const newOptions = [
              ...(value || []),
              `Option ${(value?.length || 0) + 1}`,
            ];
            onChange?.(newOptions);
          }}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-1" />
          Утга нэмэх
        </Button>
      </div>
    </div>
  );
};

export default FormOptionsInput;
