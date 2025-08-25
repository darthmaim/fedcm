import { IdentityAssertionField, IdentityAssertionRequest } from './types';

export type * from './types';


/** Verifies that the request has the required `Sec-Fetch-Dest: webidentity` header */
export function isValidWebIdentityRequest(request: Request): boolean {
  return request.headers.has('Sec-Fetch-Dest') && request.headers.get('Sec-Fetch-Dest') === 'webidentity';
}


/**
 * Parse `FormData` to an validated assertion request.
 *
 * @param formData FormData containing the assertion request.
 * @returns Parsed `IdentityAssertionRequest`.
 * @throws {@link FedCMServerError} if required fields are missing.
 */
export function parseIdentityAssertionRequest(formData: FormData): IdentityAssertionRequest {
  const client_id = getFormDataString(formData, 'client_id');
  if(!client_id) {
    throw new FedCMServerError('`client_id` is missing');
  }

  const account_id = getFormDataString(formData, 'account_id');
  if(!account_id) {
    throw new FedCMServerError('`account_id` is missing')
  }

  const nonce = getFormDataString(formData, 'nonce');
  const is_auto_selected = getFormDataString(formData, 'is_auto_selected') === 'true';
  const params = parseParams(getFormDataString(formData, 'params'));
  const fields = getFormDataString(formData, 'fields')?.split(',');

  const disclosure_text_shown = getFormDataString(formData, 'disclosure_text_shown') === 'true';
  const disclosure_shown_for: IdentityAssertionField[] = getFormDataString(formData, 'disclosure_shown_for')?.split(',')
    ?? disclosure_text_shown ? ['name', 'email', 'picture'] : [];

  return {
    client_id,
    account_id,
    nonce,
    is_auto_selected,
    params,
    fields,
    disclosure_text_shown,
    disclosure_shown_for,
  }
}

export class FedCMServerError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, FedCMServerError.prototype);
  }
}

function getFormDataString(formData: FormData, name: string): string | undefined {
  const value = formData.get(name);

  if(value === null || typeof value !== 'string') {
    return undefined;
  }

  return value.trim();
}

function parseParams(params?: string): unknown {
  if(!params) {
    return {};
  }

  try {
    return JSON.parse(params);
  } catch {
    console.error('Could not parse Fed-CM params as json', params);
  }

  return {};
}
