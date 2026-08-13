import { useState } from 'react';
import { fields } from '@keystatic/core';
import { inline } from '@keystatic/core/content-components';
import { Button, ButtonGroup } from '@keystar/ui/button';
import { Dialog, DialogContainer, useDialogContainer } from '@keystar/ui/dialog';
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
type Datei = { data: Uint8Array; extension: string; filename: string };
type DokumentValue = { datei: Datei | null; titel: string };

/**
 * Keeps the extension but slugifies the rest, so umlauts and spaces from a
 * German filename ("Anmeldeformular Kindergarten 2026.pdf") never end up in the
 * public URL.
 */
function normalizeDateiname(filename: string): string {
  const match = /^(.*?)(\.[^./]+)?$/.exec(filename);
  const base = slugify(match?.[1] ?? filename) || 'dokument';
  const extension = match?.[2]?.toLowerCase() ?? '';
  return `${base}${extension}`;
}

/**
 * Opens the browser's file picker, restricted to PDFs — a filter `fields.file`
 * itself does not offer. Resolves to null when the dialog is cancelled.
 */
function pdfWaehlen(): Promise<Datei | null> {
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
        filename: normalizeDateiname(file.name),
      });
    });
    input.addEventListener('cancel', () => resolve(null));
    input.click();
  });
}

function DokumentDialog(props: {
  value: DokumentValue;
  onSubmit: (value: DokumentValue) => void;
}) {
  const { dismiss } = useDialogContainer();
  const [datei, setDatei] = useState(props.value.datei);
  const [titel, setTitel] = useState(props.value.titel);

  return (
    <Dialog size="small">
      <Heading>Dokument verlinken</Heading>
      <Content>
        <VStack gap="large">
          <VStack gap="regular" alignItems="start">
            <Button
              onPress={async () => {
                const gewaehlt = await pdfWaehlen();
                if (gewaehlt) setDatei(gewaehlt);
              }}
            >
              {datei ? 'Andere Datei wählen …' : 'PDF auswählen …'}
            </Button>
            <Text size="small" color="neutralSecondary">
              {datei ? datei.filename : 'Noch keine Datei gewählt'}
            </Text>
          </VStack>
          <TextField
            label="Link-Text"
            description="Wird im Fließtext angezeigt, z. B. „Anmeldeformular“"
            value={titel}
            onChange={setTitel}
            autoFocus
          />
        </VStack>
      </Content>
      <ButtonGroup>
        <Button onPress={dismiss}>Abbrechen</Button>
        <Button
          prominence="high"
          isDisabled={!datei}
          onPress={() => {
            if (!datei) return;
            props.onSubmit({ datei, titel: titel.trim() || datei.filename });
            dismiss();
          }}
        >
          Übernehmen
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

/**
 * Rendered for every dokument node, regardless of selection — which is what lets
 * it open the dialog on its own. Keystatic's insert command only inserts the
 * node without selecting it, so its built-in edit popover would stay hidden
 * until the editor clicks the node.
 */
function DokumentNodeView(props: {
  value: DokumentValue;
  onChange: (value: DokumentValue) => void;
  onRemove: () => void;
}) {
  // A node without a file was just inserted -> go straight to the dialog.
  const [isOpen, setIsOpen] = useState(() => props.value.datei === null);
  const label = props.value.titel || props.value.datei?.filename || 'Dokument';

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
      <DialogContainer
        onDismiss={() => {
          setIsOpen(false);
          // Cancelled right after inserting: don't leave an empty node behind.
          if (!props.value.datei) props.onRemove();
        }}
      >
        {isOpen && (
          <DokumentDialog
            value={props.value}
            onSubmit={(value) => {
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
  dokument: inline({
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
      datei: fields.file({
        label: 'Datei',
        description: 'PDF-Dokument',
        directory: 'public/downloads',
        publicPath: '/downloads/',
        validation: { isRequired: true },
        transformFilename: normalizeDateiname,
      }),
      titel: fields.text({
        label: 'Link-Text',
        description: 'Wird im Fließtext angezeigt, z. B. „Anmeldeformular“',
      }),
    },
    NodeView: DokumentNodeView,
  }),
};
