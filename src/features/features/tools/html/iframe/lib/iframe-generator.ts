import type { IframeConfig, IframePreset, SandboxPermission, AllowPermission } from '../types/iframe';

export class IframeGenerator {
  private config: IframeConfig;

  constructor(config?: Partial<IframeConfig>) {
    this.config = this.getDefaultConfig();
    if (config) {
      this.updateConfig(config);
    }
  }

  private getDefaultConfig(): IframeConfig {
    return {
      src: '',
      width: '100%',
      height: '400',
      title: '',
      allowFullscreen: false,
      sandbox: [],
      loading: 'lazy',
      referrerPolicy: 'no-referrer-when-downgrade',
      frameBorder: '0',
      scrolling: 'auto',
      allow: [],
      name: '',
      id: '',
      className: '',
      style: ''
    };
  }

  public updateConfig(newConfig: Partial<IframeConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): IframeConfig {
    return { ...this.config };
  }

  public generateHTML(): string {
    if (!this.config.src.trim()) {
      throw new Error('Source URL is required');
    }

    const attributes: string[] = [];

    // Required attributes
    attributes.push(`src="${this.escapeAttribute(this.config.src)}"`);

    // Optional attributes
    if (this.config.width) {
      attributes.push(`width="${this.escapeAttribute(this.config.width)}"`);
    }

    if (this.config.height) {
      attributes.push(`height="${this.escapeAttribute(this.config.height)}"`);
    }

    if (this.config.title) {
      attributes.push(`title="${this.escapeAttribute(this.config.title)}"`);
    }

    if (this.config.name) {
      attributes.push(`name="${this.escapeAttribute(this.config.name)}"`);
    }

    if (this.config.id) {
      attributes.push(`id="${this.escapeAttribute(this.config.id)}"`);
    }

    if (this.config.className) {
      attributes.push(`class="${this.escapeAttribute(this.config.className)}"`);
    }

    if (this.config.style) {
      attributes.push(`style="${this.escapeAttribute(this.config.style)}"`);
    }

    // Boolean attributes
    if (this.config.allowFullscreen) {
      attributes.push('allowfullscreen');
    }

    // Sandbox attribute
    if (this.config.sandbox.length > 0) {
      attributes.push(`sandbox="${this.config.sandbox.join(' ')}"`);
    }

    // Loading attribute
    if (this.config.loading !== 'auto') {
      attributes.push(`loading="${this.config.loading}"`);
    }

    // Referrer policy
    if (this.config.referrerPolicy !== 'no-referrer-when-downgrade') {
      attributes.push(`referrerpolicy="${this.config.referrerPolicy}"`);
    }

    // Frame border (for legacy support)
    if (this.config.frameBorder !== '0') {
      attributes.push(`frameborder="${this.config.frameBorder}"`);
    }

    // Scrolling (for legacy support)
    if (this.config.scrolling !== 'auto') {
      attributes.push(`scrolling="${this.config.scrolling}"`);
    }

    // Allow attribute
    if (this.config.allow.length > 0) {
      attributes.push(`allow="${this.config.allow.join('; ')}"`);
    }

    return `<iframe ${attributes.join(' ')}></iframe>`;
  }

  public generateResponsiveWrapper(): string {
    const iframe = this.generateHTML();
    
    return `<div class="iframe-container">
  ${iframe}
</div>

<style>
.iframe-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
}

.iframe-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>`;
  }

  private escapeAttribute(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  public static getPresets(): Record<string, IframePreset> {
    return {
      youtube: {
        name: 'YouTube Video',
        description: 'Embed YouTube videos with standard settings',
        config: {
          width: '560',
          height: '315',
          title: 'YouTube video player',
          allowFullscreen: true,
          allow: ['accelerometer', 'autoplay', 'clipboard-write', 'encrypted-media', 'gyroscope', 'picture-in-picture'],
          referrerPolicy: 'strict-origin-when-cross-origin'
        }
      },
      vimeo: {
        name: 'Vimeo Video',
        description: 'Embed Vimeo videos with recommended settings',
        config: {
          width: '640',
          height: '360',
          title: 'Vimeo video player',
          allowFullscreen: true,
          allow: ['autoplay', 'fullscreen', 'picture-in-picture']
        }
      },
      googleMaps: {
        name: 'Google Maps',
        description: 'Embed Google Maps with basic functionality',
        config: {
          width: '600',
          height: '450',
          title: 'Google Maps',
          allowFullscreen: false,
          loading: 'lazy',
          referrerPolicy: 'no-referrer-when-downgrade'
        }
      },
      codepen: {
        name: 'CodePen',
        description: 'Embed CodePen demos with safe sandbox',
        config: {
          width: '100%',
          height: '300',
          title: 'CodePen Embed',
          scrolling: 'no',
          sandbox: ['allow-scripts', 'allow-same-origin']
        }
      },
      website: {
        name: 'Website',
        description: 'Generic website embed with security restrictions',
        config: {
          width: '100%',
          height: '600',
          title: 'Website',
          loading: 'lazy',
          sandbox: ['allow-scripts', 'allow-same-origin', 'allow-forms']
        }
      },
      twitter: {
        name: 'Twitter/X Embed',
        description: 'Embed Twitter/X content safely',
        config: {
          width: '550',
          height: '400',
          title: 'Twitter Tweet',
          sandbox: ['allow-scripts', 'allow-same-origin', 'allow-popups']
        }
      }
    };
  }

  public static getSandboxPermissions(): SandboxPermission[] {
    return [
      {
        value: 'allow-forms',
        label: 'Allow Forms',
        description: 'Allows form submission'
      },
      {
        value: 'allow-modals',
        label: 'Allow Modals',
        description: 'Allows opening modal windows'
      },
      {
        value: 'allow-orientation-lock',
        label: 'Allow Orientation Lock',
        description: 'Allows locking screen orientation'
      },
      {
        value: 'allow-pointer-lock',
        label: 'Allow Pointer Lock',
        description: 'Allows pointer lock API'
      },
      {
        value: 'allow-popups',
        label: 'Allow Popups',
        description: 'Allows opening popup windows'
      },
      {
        value: 'allow-popups-to-escape-sandbox',
        label: 'Allow Popups to Escape Sandbox',
        description: 'Allows popups to open without sandbox restrictions'
      },
      {
        value: 'allow-presentation',
        label: 'Allow Presentation',
        description: 'Allows presentation API'
      },
      {
        value: 'allow-same-origin',
        label: 'Allow Same Origin',
        description: 'Allows same-origin requests'
      },
      {
        value: 'allow-scripts',
        label: 'Allow Scripts',
        description: 'Allows JavaScript execution'
      },
      {
        value: 'allow-top-navigation',
        label: 'Allow Top Navigation',
        description: 'Allows navigating the top-level window'
      },
      {
        value: 'allow-top-navigation-by-user-activation',
        label: 'Allow Top Navigation (User Activation)',
        description: 'Allows top navigation only with user gesture'
      }
    ];
  }

  public static getAllowPermissions(): AllowPermission[] {
    return [
      {
        value: 'accelerometer',
        label: 'Accelerometer',
        description: 'Access to device accelerometer'
      },
      {
        value: 'autoplay',
        label: 'Autoplay',
        description: 'Allow autoplay of media'
      },
      {
        value: 'camera',
        label: 'Camera',
        description: 'Access to device camera'
      },
      {
        value: 'clipboard-read',
        label: 'Clipboard Read',
        description: 'Read from clipboard'
      },
      {
        value: 'clipboard-write',
        label: 'Clipboard Write',
        description: 'Write to clipboard'
      },
      {
        value: 'encrypted-media',
        label: 'Encrypted Media',
        description: 'Play encrypted media content'
      },
      {
        value: 'fullscreen',
        label: 'Fullscreen',
        description: 'Enter fullscreen mode'
      },
      {
        value: 'geolocation',
        label: 'Geolocation',
        description: 'Access to device location'
      },
      {
        value: 'gyroscope',
        label: 'Gyroscope',
        description: 'Access to device gyroscope'
      },
      {
        value: 'magnetometer',
        label: 'Magnetometer',
        description: 'Access to device magnetometer'
      },
      {
        value: 'microphone',
        label: 'Microphone',
        description: 'Access to device microphone'
      },
      {
        value: 'midi',
        label: 'MIDI',
        description: 'Access to MIDI devices'
      },
      {
        value: 'payment',
        label: 'Payment',
        description: 'Access to payment APIs'
      },
      {
        value: 'picture-in-picture',
        label: 'Picture-in-Picture',
        description: 'Use picture-in-picture mode'
      },
      {
        value: 'speaker-selection',
        label: 'Speaker Selection',
        description: 'Select audio output device'
      },
      {
        value: 'usb',
        label: 'USB',
        description: 'Access to USB devices'
      },
      {
        value: 'web-share',
        label: 'Web Share',
        description: 'Use Web Share API'
      }
    ];
  }

  public validateUrl(url: string): { isValid: boolean; error?: string } {
    if (!url.trim()) {
      return { isValid: false, error: 'URL is required' };
    }

    try {
      const urlObj = new URL(url);
      
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
      }

      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Invalid URL format' };
    }
  }
}