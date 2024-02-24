import { ZodError } from 'zod';

export default function ZodErrorHandler(error: ZodError) {
  const issue = error.issues[0];
  const path = issue.path;

  if (issue.code === 'invalid_type') {
    throw new Error(`${issue.message} ${path.join(', ')}`);
  }

  throw new Error(`${path}: ${issue.message}`);
}
