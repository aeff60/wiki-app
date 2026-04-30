import MDEditor from '@uiw/react-md-editor';

export function MarkdownEditor({ value, onChange }) {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={onChange}
        height={500}
        preview="edit"
      />
    </div>
  );
}
