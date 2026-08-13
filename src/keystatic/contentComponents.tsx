import { useRef, useState } from 'react';
import { fields } from '@keystatic/core';
import { inline } from '@keystatic/core/content-components';
import { Button, ButtonGroup } from '@keystar/ui/button';
import { Dialog, DialogContainer } from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { fileTextIcon } from '@keystar/ui/icon/icons/fileTextIcon';
import { Content } from '@keystar/ui/slots';
import { TextField } from '@keystar/ui/text-field';
import { Heading, Text } from '@keystar/ui/typography';
import { VStack } from '@keystar/ui/layout';
import { slugify } from '../utils/slug';

/**
 * Formatting options shared by every body field. Keystatic enables all editor
 * options by default (headings h1-h6 included), so everything the site has no
 * styling for is switched off explicitly.
 */
export const markdocOptions = {
  heading: [2, 3],
  bold: true,
  italic: true,
  orderedList: true,
  unorderedList: true,
  blockquote: true,
  table: true,
  link: true,
  divider: true,
  strikethrough: false,
  code: false,
  codeBlock: false,
  image: false,
} as const;

/** The value shape Keystatic's file field expects. */
type FileValue = { data: Uint8Array; extension: string; filename: string };
type DocumentLinkValue = { file: FileValue | null; label: string };

/**
 * Keeps the extension but slugifies the rest, so umlauts and spaces from a
 * German filename ("Anmeldeformular Kindergarten 2026.pdf") never end up in the
 * public URL.
 */
function normalizeFilename(filename: string): string {
  const match = /^(.*?)(\.[^./]+)?$/.exec(filename);
  const base = slugify(match?.[1] ?? filename) || 'dokument';
  const extension = match?.[2]?.toLowerCase() ?? '';
  return `${base}${extension}`;
}

/**
 * Opens the browser's file picker, restricted to PDFs — a filter `fields.file`
 * itself does not offer. Resolves to null when the dialog is cancelled.
 */
function pickPdf(): Promise<FileValue | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf,.pdf';
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      resolve({
        data: new Uint8Array(await file.arrayBuffer()),
        extension: 'pdf',
        filename: normalizeFilename(file.name),
      });
    });
    input.addEventListener('cancel', () => resolve(null));
    input.click();
  });
}

function DocumentLinkDialog(props: {
  value: DocumentLinkValue;
  onSubmit: (value: DocumentLinkValue) => void;
  onCancel: () => void;
}) {
  const [file, setFile] = useState(props.value.file);
  const [label, setLabel] = useState(props.value.label);

  return (
    <Dialog size="small">
      <Heading>Dokument verlinken</Heading>
      <Content>
        <VStack gap="large">
          <VStack gap="regular" alignItems="start">
            <Button
              onPress={async () => {
                const picked = await pickPdf();
                if (picked) setFile(picked);
              }}
            >
              {file ? 'Andere Datei wählen …' : 'PDF auswählen …'}
            </Button>
            <Text size="small" color="neutralSecondary">
              {file ? file.filename : 'Noch keine Datei gewählt'}
            </Text>
          </VStack>
          <TextField
            label="Link-Text"
            description="Wird im Fließtext angezeigt, z. B. „Anmeldeformular“"
            value={label}
            onChange={setLabel}
            autoFocus
          />
        </VStack>
      </Content>
      <ButtonGroup>
        <Button onPress={props.onCancel}>Abbrechen</Button>
        <Button
          prominence="high"
          isDisabled={!file}
          onPress={() => {
            if (!file) return;
            props.onSubmit({ file, label: label.trim() || file.filename });
          }}
        >
          Übernehmen
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

/**
 * Rendered for every documentLink node, regardless of selection — which is what
 * lets it open the dialog on its own. Keystatic's insert command only inserts
 * the node without selecting it, so its built-in edit popover would stay hidden
 * until the editor clicks the node.
 */
function DocumentLinkNodeView(props: {
  value: DocumentLinkValue;
  onChange: (value: DocumentLinkValue) => void;
  onRemove: () => void;
}) {
  // A node without a file was just inserted -> go straight to the dialog.
  const [isOpen, setIsOpen] = useState(() => props.value.file === null);
  /**
   * Whether this node ever received a file. A ref, not `props.value`: right
   * after submitting, the ProseMirror transaction has been dispatched but this
   * component has not re-rendered yet, so `props.value.file` would still read
   * null and the cleanup below would delete the node we just filled.
   */
  const hasFile = useRef(props.value.file !== null);
  const label = props.value.label || props.value.file?.filename || 'Dokument';

  const close = () => {
    setIsOpen(false);
    // Closed without ever picking a file: don't leave an empty node behind.
    if (!hasFile.current) props.onRemove();
  };

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        title="Dokument bearbeiten"
        onClick={() => setIsOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          color: '#2d4a2f',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <Icon src={fileTextIcon} />
        {label}
      </span>
      <DialogContainer onDismiss={close}>
        {isOpen && (
          <DocumentLinkDialog
            value={props.value}
            onCancel={close}
            onSubmit={(value) => {
              // Closes by unmounting the dialog rather than dismissing it, so
              // onDismiss does not run for a submit.
              hasFile.current = true;
              props.onChange(value);
              setIsOpen(false);
            }}
          />
        )}
      </DialogContainer>
    </>
  );
}

export const components = {
  documentLink: inline({
    label: 'Dokument-Link',
    description: 'PDF hochladen und mitten im Text verlinken',
    icon: fileTextIcon,
    schema: {
      /**
       * Uploads land flat in `public/downloads/`, which Astro copies to `dist/`
       * and the deploy workflow mirrors to Strato. Identical filenames overwrite
       * each other. `transformFilename` only covers Keystatic's own edit form —
       * the dialog above normalizes the name itself.
       */
      file: fields.file({
        label: 'Datei',
        description: 'PDF-Dokument',
        directory: 'public/downloads',
        publicPath: '/downloads/',
        validation: { isRequired: true },
        transformFilename: normalizeFilename,
      }),
      label: fields.text({
        label: 'Link-Text',
        description: 'Wird im Fließtext angezeigt, z. B. „Anmeldeformular“',
      }),
    },
    NodeView: DocumentLinkNodeView,
  }),
};
