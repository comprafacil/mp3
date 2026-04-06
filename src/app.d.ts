/// <reference types="@sveltejs/kit" />
/// <reference types="@sveltejs/adapter-cloudflare" />
/// <reference types="@cloudflare/workers-types" />

declare global {
  namespace App {
    interface Locals {
      env: {
        DB: D1Database;
        KV: KVNamespace;
        SESSION: KVNamespace;
        R2: R2Bucket;
      };
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
    interface PageData {}
    interface Error {
      message: string;
      code?: string;
    }
    interface Platform {
      env: {
        DB: D1Database;
        KV: KVNamespace;
        SESSION: KVNamespace;
        R2: R2Bucket;
      };
      context: {
        waitUntil(promise: Promise<any>): void;
      };
      caches: CacheStorage & { default: Cache };
    }
  }
}

export {};
