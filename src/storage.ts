import * as Cookies from 'es-cookie';

interface ClientStorageOptions {
  daysUntilExpire: number;
}

/**
 * Defines a type that handles storage to/from a storage location
 */
export type ClientStorage = {
  get<T extends Object>(key: string): T;
  save(key: string, value: any, options?: ClientStorageOptions): void;
  remove(key: string): void;
};

/**
 * A storage protocol for marshalling data to/from cookies
 */
export const CookieStorage = {
  get<T extends Object>(key: string) {
    const value = Cookies.get(key);
    if (typeof value === 'undefined') {
      return;
    }
    return <T>JSON.parse(value);
  },

  save(key: string, value: any, options?: ClientStorageOptions): void {
    let cookieAttributes: Cookies.CookieAttributes = {};
    if ('https:' === window.location.protocol) {
      cookieAttributes = {
        secure: true,
        sameSite: 'none'
      };
    }
    cookieAttributes.expires = options.daysUntilExpire;
    Cookies.set(key, JSON.stringify(value), cookieAttributes);
  },

  remove(key: string) {
    Cookies.remove(key);
  }
} as ClientStorage;

/**
 * A storage protocol for marshalling data to/from session storage
 */
export const SessionStorage = {
  get<T extends Object>(key: string) {
    const value = sessionStorage.getItem(key);
    if (typeof value === 'undefined') {
      return;
    }
    return <T>JSON.parse(value);
  },

  save(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  },

  remove(key: string) {
    sessionStorage.removeItem(key);
  }
} as ClientStorage;
