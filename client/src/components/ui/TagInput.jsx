import { useState, useRef } from 'react';

export function TagInput({ tags = [], onChange }) {
  const [input, setInput] = useState('');
  const ref = useRef(null);

  const add = () => {
    const val = input.trim().toLowerCase();
    if (val && !tags.includes(val)) {
      onChange([...tags, val]);
    }
    setInput('');
  };

  const remove = (tag) => onChange(tags.filter((t) => t !== tag));

  return (
    <div
      className="flex flex-wrap gap-1.5 p-2 border border-gray-300 rounded-md min-h-10 cursor-text"
      onClick={() => ref.current?.focus()}
    >
      {tags.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-sm">
          {tag}
          <button type="button" onClick={() => remove(tag)} className="hover:text-blue-900 leading-none">&times;</button>
        </span>
      ))}
      <input
        ref={ref}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
          if (e.key === 'Backspace' && !input && tags.length) onChange(tags.slice(0, -1));
        }}
        onBlur={add}
        placeholder={tags.length ? '' : 'Add tags…'}
        className="flex-1 min-w-24 outline-none text-sm bg-transparent"
      />
    </div>
  );
}
