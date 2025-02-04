import { MentionsInput, Mention } from 'react-mentions'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface MentionInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function MentionInput({ value, onChange, placeholder }: MentionInputProps) {
  const [templates] = useState([
    { id: 'professional', display: 'Professional Tone' },
    { id: 'casual', display: 'Casual Tone' },
    { id: 'global', display: 'Global Rules' },
    { id: 'format', display: 'Response Format' },
  ])

  const style = {
    suggestions: {
      list: {
        backgroundColor: 'hsl(var(--background))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        marginTop: '0.5rem',
        overflow: 'hidden',
        position: 'absolute',
        zIndex: 50,
        width: 'fit-content',
        minWidth: '200px',
        whiteSpace: 'nowrap'
      },
      item: {
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      },
    },
    input: {
      width: '100%',
      minHeight: '100px',
      padding: '0.75rem',
      border: '1px solid hsl(var(--border))',
      borderRadius: '0.5rem',
      backgroundColor: 'transparent',
      color: 'hsl(var(--foreground))',
      fontSize: '0.875rem',
      lineHeight: 1.5,
      outline: 'none',
      resize: 'vertical'
    }
  }

  return (
    <div className="relative w-full">
      <MentionsInput
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        style={style}
        placeholder={placeholder}
        a11ySuggestionsListLabel="Suggested templates"
        className={cn(
          "w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <Mention
          trigger="@"
          data={templates}
          renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
            <div className={cn(
              "text-sm",
              focused ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent/50"
            )}>
              {suggestion.display}
            </div>
          )}
          appendSpaceOnAdd
          displayTransform={(id, display) => `@${display}`}
        />
      </MentionsInput>
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
        Type @ to mention a template
      </div>
    </div>
  )
} 