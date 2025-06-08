import { CodecCategory } from '../context/CodecContext';
import codecDataJson from '../../data/codec_data.json';

// Transform the JSON data to match our TypeScript interfaces
export const defaultCodecData: CodecCategory[] = codecDataJson.map(category => ({
  id: category.id,
  name: category.name,
  description: category.description,
  codecs: category.codecs.map(codec => ({
    id: codec.id,
    name: codec.name,
    description: codec.description,
    workflowNotes: codec.workflowNotes,
    variants: codec.variants.map(variant => ({
      name: variant.name,
      description: variant.description,
      bitrates: variant.bitratesByResolution
    }))
  }))
}));