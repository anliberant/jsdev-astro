export function getElementById<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

export function getInputValue(id: string): string {
  const element = getElementById<HTMLInputElement>(id);
  return element?.value || '';
}

export function setTextContent(id: string, content: string): void {
  const element = getElementById(id);
  if (element) {
    element.textContent = content;
  }
}

export function temporaryButtonText(
  buttonId: string,
  tempText: string,
  originalText: string,
  duration = 1500
): void {
  const button = getElementById(buttonId);
  if (button) {
    button.textContent = tempText;
    setTimeout(() => {
      button.textContent = originalText;
    }, duration);
  }
}
