import React, { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { createNote } from '@/ssr/actions/note';
import { Note } from '@/lib/types/note.types';
import { usePathname } from 'next/navigation';

const CreateNoteInput = ({
  taskId,
  onSave,
}: {
  taskId: string;
  onSave?: (e: Note) => void;
}) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handleAddNote = async () => {
    setLoading(true);
    try {
      const res = await createNote(
        {
          taskId,
          content,
        },
        pathname
      );
      if (res.code === 200) {
        onSave?.(res.data);
        setContent('');
        return;
      }
      throw new Error(res?.message);
    } catch (err) {
      let message = '';
      if (err instanceof Error) {
        message = err.message;
      }
      toast({
        variant: 'destructive',
        title: 'Амжилтгүй',
        description: message || 'Тэмдэглэл хадгалахад алдаа гарлаа',
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex gap-6">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Тэмдэглэл бичих..."
        className="flex-1"
      />
      <Button onClick={handleAddNote} disabled={!content.trim() || loading}>
        Хадгалах
      </Button>
    </div>
  );
};

export default CreateNoteInput;
