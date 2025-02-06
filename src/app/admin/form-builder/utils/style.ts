export const getWidthClass = (width?: string): string => {
  switch (width) {
    case '1/2': return 'w-1/2';
    case '1/3': return 'w-1/3';
    case '2/3': return 'w-2/3';
    case '1/4': return 'w-1/4';
    case '3/4': return 'w-3/4';
    default: return 'w-full';
  }
};

export const getPaddingClass = (padding?: string): string => {
  switch (padding) {
    case 'small': return 'p-2';
    case 'medium': return 'p-4';
    case 'large': return 'p-6';
    default: return 'p-0';
  }
};

export const getMarginClass = (margin?: string): string => {
  switch (margin) {
    case 'small': return 'm-2';
    case 'medium': return 'm-4';
    case 'large': return 'm-6';
    default: return 'm-0';
  }
}; 