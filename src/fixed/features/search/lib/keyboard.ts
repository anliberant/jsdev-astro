export interface KeyboardShortcut {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  preventDefault?: boolean;
  action: () => void;
}

export class KeyboardManager {
  private shortcuts: KeyboardShortcut[] = [];
  private isListening = false;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  addShortcut(shortcut: KeyboardShortcut): void {
    this.shortcuts.push(shortcut);
  }

  removeShortcut(key: string): void {
    this.shortcuts = this.shortcuts.filter(s => s.key !== key);
  }

  startListening(): void {
    if (!this.isListening) {
      document.addEventListener('keydown', this.handleKeyDown);
      this.isListening = true;
    }
  }

  stopListening(): void {
    if (this.isListening) {
      document.removeEventListener('keydown', this.handleKeyDown);
      this.isListening = false;
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const activeElement = document.activeElement;
    if (activeElement && 
        (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') &&
        event.key !== 'Escape') {
      return;
    }

    for (const shortcut of this.shortcuts) {
      const metaMatch = shortcut.metaKey ? event.metaKey : !event.metaKey;
      const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey;
      
      if (event.key === shortcut.key && metaMatch && ctrlMatch) {
        if (shortcut.preventDefault) {
          event.preventDefault();
        }
        shortcut.action();
        break;
      }
    }
  }
}