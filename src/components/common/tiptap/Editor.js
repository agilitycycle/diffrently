import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {fbPush, fbUpdate} from '../../../services/firebaseService';
import {mergeAttributes, Node} from '@tiptap/core';
import {NodeViewWrapper, ReactNodeViewRenderer} from '@tiptap/react';
import {Color} from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import {EditorProvider, useCurrentEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {updateSubjectState, subjectState} from '../../../app/slices/subjectSlice.js';
import './styles.css';

// https://tiptap.dev/docs/editor/getting-started/install/react?gad_source=1&gclid=CjwKCAiApsm7BhBZEiwAvIu2XwubtoP3gFq2ssgn7Vc5c78Y0meg2NMnf8utyr3HaRyYO0ihqd5e5RoC7PMQAvD_BwE

const SuggestView = () => {
  return (
    <NodeViewWrapper className="suggest w-5/12">
      <label>Suggest</label>

      <div className="content text-base text-secondary/75">
        The opening whisper you might ponder lies in CREATION.
        <div className="pt-2.5">
          <button type="button" className="px-3 py-2 mr-2.5 text-xs font-bold text-center inline-flex items-center text-[#ffffff] bg-[#6a00f5] border border-[#6a00f5] rounded-lg">
            YES
          </button>
          <button type="button" className="px-3 py-2 text-xs font-bold text-center inline-flex items-center text-[#6a00f5] border border-[#6a00f5] rounded-lg">
            NO
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  )
}

const Suggest = Node.create({
  name: 'suggest',
  group: 'block',
  content: 'block*',
  gapCursor: false,

  parseHTML() {
    return [
      {
        tag: 'suggest',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['suggest', mergeAttributes(HTMLAttributes)]
  },

  addCommands() {
    return {
      toggleSuggest: () => ({ commands }) => {
        commands.deleteSelection();
        return commands.insertContent({ type: this.name });
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(SuggestView);
  },
});

const ExpandedMenu = () => {
  const {editor} = useCurrentEditor()

  if (!editor) {
    return null
  }

  const getStyles = (style, variant) => {
    let isActive;

    if (style && !variant) {
      isActive = editor.isActive(style);
    }

    if (style && variant) {
      isActive = editor.isActive(style, variant);
    }

    const bgStyle = isActive ? 'bg-blue-600 text-primary/90' :
    `theme-light:bg-neutral-200/60 theme-light:text-secondary/95
    theme-dark:bg-secondary/5 theme-dark:text-secondary/70`;

    return `${bgStyle} px-2 py-1 rounded-lg text-sm font-medium`;
  }

  return (
    <div className="sticky top-0 flex flex-row gap-1 items-start">
      <div className="flex flex-row flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className={getStyles('bold')}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className={getStyles('italic')}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleStrike()
              .run()
          }
          className={getStyles('strike')}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleCode()
              .run()
          }
          className={getStyles('code')}
        >
          Code
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className={getStyles()}>
          Clear marks
        </button>
        <button onClick={() => editor.chain().focus().clearNodes().run()}
          className={getStyles()}>
          Clear nodes
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={getStyles('paragraph')}
        >
          Paragraph
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={getStyles('heading', {level: 1})}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={getStyles('heading', {level: 2})}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={getStyles('heading', {level: 3})}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={getStyles('heading', {level: 4})}
        >
          H4
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={getStyles('heading', {level: 5})}
        >
          H5
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={getStyles('heading', {level: 6})}
        >
          H6
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={getStyles('bulletList')}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={getStyles('orderedList')}
        >
          Ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={getStyles('codeBlock')}
        >
          Code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={getStyles('blockquote')}
        >
          Blockquote
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={getStyles()}>
          Horizontal rule
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}
          className={getStyles()}>
          Hard break
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className={getStyles()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .undo()
              .run()
          }
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className={getStyles()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .redo()
              .run()
          }
        >
          Redo
        </button>
        <button
          onClick={() => editor.chain().focus().setColor('#958DF1').run()}
          className={getStyles('textStyle', {color: '#958DF1'})}
        >
          Purple
        </button>
      </div>
    </div>
  )
}

const Menu = () => {
    const {editor} = useCurrentEditor()

    if (!editor) {
      return null
    }

    const getStyles = (style, variant) => {
      let isActive;

      if (style && !variant) {
        isActive = editor.isActive(style);
      }

      if (style && variant) {
        isActive = editor.isActive(style, variant);
      }

      const bgStyle = isActive ? 'bg-blue-600 text-primary/90' :
      `theme-light:bg-neutral-200/60 theme-light:text-secondary/95
      theme-dark:bg-secondary/5 theme-dark:text-secondary/70`;

      return `${bgStyle} px-2 py-1 rounded-lg text-sm font-medium`;
    }
  
    return (
      <div className="sticky top-0 flex flex-row gap-1 items-start">
        <div className="flex flex-row flex-wrap gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
            className={getStyles('bold')}
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
            className={getStyles('italic')}
          >
            Italic
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={getStyles('paragraph')}
          >
            Paragraph
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={getStyles('heading', {level: 1})}
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={getStyles('heading', {level: 2})}
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={getStyles('heading', {level: 3})}
          >
            H3
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleSuggest().run()}
            className={getStyles('suggest')}
          >
            Suggest
          </button>
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className={getStyles()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .undo()
                .run()
            }
          >
            Undo
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className={getStyles()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .redo()
                .run()
            }
          >
            Redo
          </button>
        </div>
      </div>
    )
}

const extensions = [
  Suggest,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
]

const content = `
  <h2>
    Your title here
  </h2>
  <p>
    Start your writing here...
  </p>
`
/**
 * 
 * @array
 * 
 */
export const Editor = ({items}) => {
  const dispatch = useDispatch();
  const currentSubjectState = useSelector(subjectState);
  const [value, setValue] = useState(undefined);
  let newContent = '';

  if (items && items.length === 0) newContent = content;

  if (items && items.length > 0) {
    for (let i in items) {
      newContent += items[i].content;
    }
  }

  const handleAdd = () => {
    const object = {
      dateCreated: moment().valueOf(),
      content: value
    }

    // timeline
    const timelineId = fbPush('/userTimelineV2/-OEs3jR0LGwzH1oAOkma/post/', Object.assign({},
      object, {
        chapter: 1
      }
    ));

    // books
    fbPush('/userBooks/-OEs3jR0LGwzH1oAOkma/pages/chapter-1', Object.assign({},
      object, {
        order: 0,
        timelineId: timelineId
      }
    ));

    // update
    fbUpdate('/userSubject/-NrnSwk-t38iZWOB76Lt/subjects/-OEs3jR0LGwzH1oAOkma', {
      started: true
    })
  }

  useEffect(() => {
    const newSubjectState = Object.assign({...currentSubjectState}, {
      editorContent: value
    });
    dispatch(updateSubjectState(newSubjectState));
  }, [value])

  return (<div className="!m-0 h-[calc(100vh-232px)]">
    <EditorProvider
      slotBefore={<Menu/>}
      extensions={extensions}
      content={newContent}
      onUpdate={({editor}) => {
        setValue(editor.getHTML());
      }}
    >
    </EditorProvider>
    {/*<button onClick={handleAdd}>test</button>*/}
  </div>);
}