---
import { generateToolsBreadcrumbs } from '@/shared/helpers/breadcrumbs.helpers';
import Breadcrumbs from '@/shared/ui/base/breadcrumbs.astro';
import ConverterHeader from '@/shared/ui/converters/converter-header.astro';
import ConverterPanel from '@/shared/ui/converters/converter-panel.astro';
import HeadingBlock from '@/shared/ui/layout/heading-block.astro';

const breadcrumbItems = generateToolsBreadcrumbs('HTML Encoder & Decoder');

const converterOptions = [
  { id: 'prettyFormatOption', label: 'Pretty Format', checked: true },
  { id: 'specialCharsOption', label: 'Special Characters', checked: true },
  { id: 'numericEntitiesOption', label: 'Numeric Entities', checked: false },
];
---

<Breadcrumbs
  items={breadcrumbItems}
  class='mt-10'
/>

<HeadingBlock
  title='HTML Encoder & Decoder'
  description='Encode and decode HTML entities quickly and easily with our bidirectional converter tool.'
  class='mt-0'
/>

<ConverterHeader
  options={converterOptions}
  class='mt-10'
/>

<div class='main-content'>
  <ConverterPanel
    type='input'
    title='HTML Input'
    icon='📝'
    textareaId='htmlInput'
    placeholder='Paste your HTML content here...'
    showSampleButton={true}
    showStats={true}
  />

  <ConverterPanel
    type='output'
    title='Encoded/Decoded Output'
    icon='🔐'
    textareaId='htmlOutput'
    placeholder='Encoded or decoded content will appear here...'
    readonly={true}
    showStats={true}
  />
</div>

<script>
  import { HtmlEncoderDecoderController } from './lib/encoder-controller';
  import { initializeConverter } from './lib/converter-init-helper';

  const REQUIRED_ELEMENTS = [
    'htmlInput',
    'htmlOutput',
    'convertBtn',
    'clearBtn',
    'copyBtn'
  ];

  initializeConverter(
    'htmlEncoderDecoder',
    HtmlEncoderDecoderController,
    REQUIRED_ELEMENTS,
    true
  ).then(controller => {
    if (controller) {
      console.log('HTML Encoder & Decoder ready!');
    } else {
      console.error('Failed to initialize HTML Encoder & Decoder');
      
      const errorMessage = document.getElementById('errorMessage');
      if (errorMessage) {
        errorMessage.textContent = 'Failed to initialize converter. Please refresh the page.';
        errorMessage.classList.remove('hidden');
      }
    }
  }).catch(error => {
    console.error('Converter initialization error:', error);
  });
</script>