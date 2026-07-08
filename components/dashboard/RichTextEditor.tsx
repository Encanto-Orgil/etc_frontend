"use client";

import {
  BoldOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  PictureOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button, Input, Modal, message } from "antd";
import { useEffect, useRef } from "react";
import styles from "./RichTextEditor.module.css";

type RichTextEditorProps = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  onUploadImage?: (file: File) => Promise<string>;
};

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write the article body…",
  onUploadImage,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkUrlRef = useRef("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
    },
    onUpdate: ({ editor: current }) => {
      onChange?.(current.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  const setLink = () => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    linkUrlRef.current = previous || "";
    Modal.confirm({
      title: "Insert link",
      content: (
        <Input
          defaultValue={linkUrlRef.current}
          placeholder="https://"
          onChange={(event) => {
            linkUrlRef.current = event.target.value;
          }}
        />
      ),
      onOk: () => {
        const url = linkUrlRef.current.trim();
        if (!url) {
          editor.chain().focus().extendMarkRange("link").unsetLink().run();
          return;
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
      },
    });
  };

  const handleImageUpload = async (file: File) => {
    if (!editor || !onUploadImage) return;
    try {
      const url = await onUploadImage(file);
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Image upload failed.");
    }
  };

  if (!editor) {
    return <div className={styles.shell}>Loading editor…</div>;
  }

  return (
    <div className={styles.shell}>
      <div className={styles.toolbar}>
        <Button
          type={editor.isActive("bold") ? "primary" : "default"}
          size="small"
          icon={<BoldOutlined />}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <Button
          type={editor.isActive("italic") ? "primary" : "default"}
          size="small"
          icon={<ItalicOutlined />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <Button
          type={editor.isActive("underline") ? "primary" : "default"}
          size="small"
          icon={<UnderlineOutlined />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <Button
          type={editor.isActive("heading", { level: 2 }) ? "primary" : "default"}
          size="small"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Button>
        <Button
          type={editor.isActive("heading", { level: 3 }) ? "primary" : "default"}
          size="small"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </Button>
        <Button
          type={editor.isActive("bulletList") ? "primary" : "default"}
          size="small"
          icon={<UnorderedListOutlined />}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <Button
          type={editor.isActive("orderedList") ? "primary" : "default"}
          size="small"
          icon={<OrderedListOutlined />}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <Button size="small" icon={<LinkOutlined />} onClick={setLink} />
        <Button
          size="small"
          icon={<PictureOutlined />}
          disabled={!onUploadImage}
          onClick={() => fileInputRef.current?.click()}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void handleImageUpload(file);
          }}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
