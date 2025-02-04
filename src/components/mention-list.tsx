import { forwardRef } from 'react'

interface MentionListProps {
  items: string[]
  command: (item: string) => void
  selectedIndex: number
}

const MentionList = forwardRef<HTMLDivElement, MentionListProps>((props, ref) => {
  return (
    <div 
      ref={ref} 
      className="bg-popover border rounded-md shadow-md overflow-hidden py-1"
    >
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            key={index}
            className={`
              w-full text-left px-3 py-1.5 text-sm
              ${props.selectedIndex === index ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-accent/50'}
            `}
            onClick={() => props.command(item)}
          >
            {item}
          </button>
        ))
      ) : (
        <div className="px-3 py-1.5 text-sm text-muted-foreground">
          No templates found
        </div>
      )}
    </div>
  )
})

MentionList.displayName = 'MentionList'

export default MentionList 