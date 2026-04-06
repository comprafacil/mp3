/// <reference types="@sveltejs/kit" />
/// <reference types="@sveltejs/adapter-cloudflare" />

declare global {
  namespace App {
    interface Locals {
      env: {
        DB: D1Database;
        KV: KVNamespace;
        SESSION: KVNamespace;
        R2: R2Bucket;
      };
    }
    interface PageData {}
    interface Error {}
    interface Platform {}
  }
}

export {};
