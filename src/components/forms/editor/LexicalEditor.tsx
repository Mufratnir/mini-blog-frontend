import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot } from 'lexical';

const theme = {
  paragraph: 'mb-2',
};

type Props = {
  onChange: (value: string) => void;
};

const LexicalEditor = ({ onChange }: Props) => {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError(error: any) {
      console.error(error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border rounded p-3 min-h-[150px]">
        <RichTextPlugin
          contentEditable={<ContentEditable className="outline-none" />}
          placeholder={<div>Write something...</div>}
        />
        <HistoryPlugin />
        <OnChangePlugin
          onChange={(editorState, editor) => {
            editorState.read(() => {
              const text = $getRoot().getTextContent();
              onChange(text);
            });
          }}
        />
      </div>
    </LexicalComposer>
  );
};

export default LexicalEditor;
