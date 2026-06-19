import { component, fields, NotEditable } from '@keystatic/core';

export const componentBlocks = {
  hinweis: component({
    label: 'Hinweis-Box',
    schema: {
      text: fields.text({ label: 'Text', multiline: true }),
    },
    preview: (props) => (
      <NotEditable>
        <div
          style={{
            borderLeft: '4px solid #b8834a',
            background: '#f7f3ec',
            padding: '12px 16px',
            borderRadius: 6,
          }}
        >
          {props.fields.text.value || 'Hinweis …'}
        </div>
      </NotEditable>
    ),
  }),
};
