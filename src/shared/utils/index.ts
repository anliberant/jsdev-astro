export * from './sample-html';
export * from './classes';
export * from './format-url';
export * from './time';

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

export function getElementById<T extends HTMLElement>(id: string): T | null {
  try {
    return document.getElementById(id) as T | null;
  } catch (error) {
    console.error(`Error getting element with id "${id}":`, error);
    return null;
  }
}

export function getInputValue(id: string): string {
  const element = getElementById<HTMLInputElement | HTMLTextAreaElement>(id);
  return element?.value || '';
}

export function setTextContent(id: string, content: string): void {
  const element = getElementById(id);
  if (element) {
    element.textContent = content;
  }
}

export function temporaryButtonText(
  button: HTMLElement,
  tempText: string,
  originalText: string,
  duration: number = 2000
): void {
  const original = button.textContent || originalText;
  button.textContent = tempText;
  
  setTimeout(() => {
    button.textContent = original;
  }, duration);
}

export function safeAddEventListener(
  element: HTMLElement | null,
  event: string,
  handler: EventListener
): void {
  if (element && typeof element.addEventListener === 'function') {
    try {
      element.addEventListener(event, handler);
    } catch (error) {
      console.error(`Error adding event listener to element:`, error);
    }
  } else {
    console.warn(`Cannot add event listener to element: ${element}`);
  }
}

export function calculateStats(text: string): { lines: number; characters: number } {
  return {
    lines: text ? text.split('\n').length : 0,
    characters: text ? text.length : 0,
  };
}