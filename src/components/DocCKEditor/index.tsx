import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import EventInfo from '@ckeditor/ckeditor5-utils/src/eventinfo';

import './index.css';

interface Props {
  disabled?: boolean;
  data?: string;
  onChange?: (event: EventInfo<string, any>, editor: ClassicEditor) => void;
}

function DocCKEditor({ disabled, data, onChange }: Props) {
  return (
    <CKEditor
      disabled={disabled}
      editor={ClassicEditor}
      config={{
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList'],
      }}
      data={data}
      onChange={onChange}
    />
  );
}

export default DocCKEditor;
