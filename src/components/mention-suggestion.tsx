import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import MentionList from './mention-list.tsx'
import 'tippy.js/dist/tippy.css'

export default {
  items: ({ query }: { query: string }) => {
    return [
      'Professional Tone',
      'Casual Tone',
      'Global Rules',
      'Response Format',
    ]
      .filter(item => item
        .toLowerCase()
        .startsWith(query.toLowerCase())
      )
      .slice(0, 5)
  },

  render: () => {
    let component: any
    let popup: any

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        })

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props: any) {
        component.updateProps(props)

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup[0].hide()
          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
} 