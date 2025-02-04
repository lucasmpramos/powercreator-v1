const styles = {
  dropZone: {
    base: "min-h-[100px] rounded-lg transition-all relative",
    empty: "border-2 border-dashed border-gray-200",
    active: "border-primary",
    spacing: "space-y-8",
  },
  handle: {
    base: "w-2 h-2 opacity-0 group-hover:opacity-100",
  },
  dropIndicator: {
    base: "h-1 bg-primary/50 rounded-full my-2 absolute left-0 right-0 z-10",
    top: "-top-3",
    bottom: "-bottom-3",
  },
  container: {
    base: "relative z-50 grid w-full gap-4 bg-background p-6 shadow-lg sm:rounded-lg border",
  },
  heading: {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  },
  input: {
    base: "w-full max-w-sm",
    textarea: "flex min-h-[80px] w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
  },
  text: {
    paragraph: "leading-7 [&:not(:first-child)]:mt-6",
    placeholder: "text-sm text-muted-foreground text-center p-4",
  },
  selected: "ring-2 ring-primary ring-offset-2 rounded-sm",
  focused: "ring-1 ring-primary/50 ring-dashed rounded-sm",
} as const;

export type Styles = typeof styles;
export { styles }; 