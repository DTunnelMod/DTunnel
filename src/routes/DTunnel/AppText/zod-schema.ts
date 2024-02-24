import { z } from 'zod';
import AppTextDefault from './defaults';

const labels = AppTextDefault.map((value) => value.label);

export const AppTextUpdateSchema = z.object({
  label: z.custom<string>((val: any) => labels.includes(val)),
  text: z.string(),
});
