/** Either `provider_urls` or both `accounts_endpoint` and `login_url` are required. If the config file contains the `client_metadata_endpoint`, then both `accounts_endpoint` and `login_url` are required. */
export type IdentityProviderWellKnown = IdentityProviderWellKnownProvider | IdentityProviderWellKnownAccountLogin;

export interface IdentityProviderWellKnownProvider {
  /** A list of URLs that points to valid config files */
  provider_urls: string[],
}

export interface IdentityProviderWellKnownAccountLogin {
  /** A URL that points to the same location as the accounts_endpoint in the config files. */
  accounts_endpoint: string;

  /** A URL that points to the same location as the login_url in the config files. */
  login_url: string;
}

export interface IdentityProviderIcon {
  /**
   * The url pointing to the icon image, which must be square and single resolution (not a multi-resolution .ico).
   * The icon needs to comply with the [maskable](https://www.w3.org/TR/appmanifest/#icon-masks) specification.
   */
  url: string,

  /** The width/height of the square icon. The size may be omitted if the icon is in a vector graphic format (like SVG). */
  size?: number,
}

export interface IdentityProviderBranding {
  /**
   * Background color for IDP-branded widgets such as buttons.
   *
   * The color is a subset of CSS <color> syntax, namely <hex-color>s, hsl()s, rgb()s and <named-color>.
   */
  background_color?: string,

  /**
   * color for text on IDP branded widgets.
   *
   * The color is a subset of CSS <color> syntax, namely <hex-color>s, hsl()s, rgb()s and <named-color>.
   */
  color?: string,

  /** A list of IdentityProviderIcon objects. */
  icons?: IdentityProviderIcon[],

  /** A user-recognizable name for the IDP. */
  name: string,
}

export interface IdentityProviderAPIConfig {
  /** A URL that points to an HTTP API that complies with the Accounts endpoint API. */
  accounts_endpoint: string,

  /** A URL that points to an HTTP API that complies with the Client Metadata API. */
  client_metadata_endpoint?: string,

  /** A URL that points to an HTTP API that complies with the Identity assertion endpoint API. */
  id_assertion_endpoint: string,

  /** A URL that points to the login page of the IDP. */
  login_url: string,

  /** A URL that points to an HTTP API that complies with the Disconnect endpoint API. */
  disconnect_endpoint?: string,

  /** A set of IdentityProviderBranding options. */
  branding?: IdentityProviderBranding,

  /**
   * A boolean determining whether the user should be shown the possibility to log into a different account even if they are already logged in. Only used in active mode calls.
   * @default false
   */
  supports_use_other_account?: boolean;

  /** An optional string that needs to match the `label_hints` provided by the IdP. */
  account_label?: string;
}

export interface IdentityProviderAccount {
  /** The account unique identifier. */
  id: string,

  /** The user’s full name. */
  name?: string,

  /** The user’s email address. */
  email?: string,

  /** The user’s telephone number. */
  tel?: string,

  /** The user’s username. */
  username?: string,

  /** The user’s given name. */
  given_name?: string,

  /** URL for the account’s picture. */
  picture?: string,

  /**
   *  A list of RPs (that gets matched against the requesting clientId) this account is already registered with.
   *
   * Used in the request permission to sign-up to allow the IDP to control whether to show the Privacy Policy and the Terms of Service.
   */
  approved_clients?: string[],

  /**
   * A list of strings which correspond to all of the login hints which match with this account.
   * An RP can use the loginHint to request that only an account matching a given value is shown to the user.
   */
  login_hints?: string[],

  /**
   * A list of strings which correspond to all of the domain hints which match with this account.
   * An RP can use the domainHint to request that only an account matching a given value or containing some domain hint is shown to the user.
   */
  domain_hints?: string[],

  /**
   *
   */
  label_hints?: string[],
}

export interface IdentityProviderAccountList {
  accounts: IdentityProviderAccount[],
}

export interface IdentityProviderClientMetadata {
  /** A link to the RP's Privacy Policy. */
  privacy_policy_url?: string,

  /** A link to the RP's Terms of Service. */
  terms_of_service_url?: string,
}

/**
 * Only one of token, continue_on, or error should be specified.
 *
 * When multiple are specified, the order of processing is [error, token, continue_on], so the first encountered will be used in the response.
 */
export type IdentityAssertionResponse = IdentityAssertionTokenResponse | IdentityAssertionContinueOnResponse | IdentityAssertionErrorResponse;

export interface IdentityAssertionTokenResponse {
  /** The resulting token. The value is of type any, allowing IDPs to return tokens in various formats (string, object, etc.). */
  token: any,
}

export interface IdentityAssertionContinueOnResponse {
  /** A URL that the user agent will open in a popup to finish the authentication process. */
  continue_on: string,
}

export interface IdentityAssertionErrorResponse {
  /** A dictionary containing the error that occurred when the ID assertion was fetched. */
  error: IdentityCredentialErrorInit,
}

export interface IdentityCredentialErrorInit {
  /**
   * The type of error which resulted in an IdentityCredential not being created.
   *
   * An IDP MUST NOT expose sensitive user information in this field, since it is exposed to the RP. */
  error?: string,

  /** A URL where the user can learn more information about the error. */
  url?: string,
}

export interface IdentityAssertionRequest {
  /** The RP’s unique identifier from the IDP. */
  client_id: string,

  /** The account identifier that was selected. */
  account_id: string,

  /** @deprecated */
  nonce?: string,

  /** A boolean indicating whether the account was automatically selected as opposed to being actively chosen by the user. */
  is_auto_selected: boolean,

  /** A serialized JSON object provided by the RP that can have an arbitrary structure and content. */
  params?: unknown,

  /** The list of fields that the RP has requested in fields. */
  fields?: IdentityAssertionField[],

  /** Whether the user agent has explicitly shown to the user what specific information the IDP intends to share with the RP */
  disclosure_text_shown?: boolean,

  /**
   * The list of fields that the user was prompted for.
   *
   * This can be a subset of `fields` if a field is requested that is not in the list of recognized fields.
   */
  disclosure_shown_for?: IdentityAssertionField[]
}

export type IdentityAssertionField = IdentityAssertionRecognizedField | (string & {});

/** A list of recognized fields */
export type IdentityAssertionRecognizedField =
  | 'name'
  | 'email'
  | 'tel'
  | 'username'
  | 'picture';

interface DisconnectedAccount {
  account_id: string,
}
