/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(home)` | `/(home)/` | `/..\components\Map` | `/_sitemap` | `/auth` | `/auth/` | `/details`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
