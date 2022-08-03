import { reactive } from '@starbeam/js';
import { Cell } from '@starbeam/core';

export class Queries {
  readonly #queries = reactive.Map<
    string,
    { state: Cell<Async>; query: Query }
  >();

  query<T>(key: string, query: () => Promise<T>): Async<T> {
    let result = this.#queries.get(key);

    if (!result) {
      result = { state: Cell({ status: 'idle' }), query };
      this.#queries.set(key, result);
    }

    return result.state.current as Async<T>;
  }

  fetch(key: string): void {
    const result = this.#queries.get(key);

    if (!result) {
      throw Error(
        `You attempted to fetch a query (key = ${key}), but no query with that name was registered.`
      );
    }

    result.state.update((state) => {
      if (state.status === 'idle') {
        result
          .query()
          .then((data) => {
            result.state.set({ status: 'loaded', data });
          })
          .catch((reason) => {
            result.state.set({ status: 'error', reason });
          });

        return { status: 'loading' };
      }

      return state;
    });
  }
}

export const QUERIES = new Queries();

export type Query<T = unknown> = () => Promise<T>;

export type Async<T = unknown> =
  | {
      status: 'idle';
    }
  | {
      status: 'loading';
    }
  | {
      status: 'loaded';
      data: T;
    }
  | { status: 'error'; reason: unknown };
