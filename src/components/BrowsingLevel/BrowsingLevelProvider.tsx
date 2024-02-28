import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  BrowsingLevel,
  getIsPublicBrowsingLevel,
  publicBrowsingLevelsFlag,
} from '~/shared/constants/browsingLevel.constants';
import { useCookies } from '~/providers/CookiesProvider';
import { Flags } from '~/shared/utils';
import { setCookie } from '~/utils/cookies-helpers';
import { createStore, useStore } from 'zustand';
import { trpc } from '~/utils/trpc';
import { useDebouncer } from '~/utils/debouncer';
import { useSession } from 'next-auth/react';
import { useDidUpdate } from '@mantine/hooks';
import { invalidateModeratedContent } from '~/utils/query-invalidation-utils';

type StoreState = {
  showNsfw: boolean;
  blurNsfw: boolean;
  browsingLevel: number;
};
type BrowsingModeStore = ReturnType<typeof createBrowsingModeStore>;
const createBrowsingModeStore = (props: StoreState) =>
  createStore<StoreState>(() => ({ ...props }));

function useBrowsingModeStore<T>(selector: (state: StoreState) => T) {
  const store = useContext(BrowsingModeCtx);
  if (!store) throw new Error('missing BrowsingModeProvider');
  return useStore(store, selector);
}

const BrowsingModeCtx = createContext<BrowsingModeStore | null>(null);
export function useBrowsingModeContext() {
  const store = useContext(BrowsingModeCtx);
  if (!store) throw new Error('missing BrowsingModeProvider');
  return {
    ...store,
    useStore: useBrowsingModeStore,
    toggleShowNsfw: (showNsfw?: boolean) =>
      store.setState((state) => ({ showNsfw: showNsfw ?? !state.showNsfw })),
    toggleBlurNsfw: (blurNsfw?: boolean) =>
      store.setState((state) => ({ blurNsfw: blurNsfw ?? !state.blurNsfw })),
    toggleBrowsingLevel: (level: BrowsingLevel) => {
      store.setState((state) => {
        const instance = state.browsingLevel;
        const browsingLevel = !instance
          ? level
          : Flags.hasFlag(instance, level)
          ? Flags.removeFlag(instance, level)
          : Flags.addFlag(instance, level);
        return { browsingLevel };
      });
    },
  };
}

function updateCookieValues({ browsingLevel, blurNsfw, showNsfw }: StoreState) {
  setCookie('level', browsingLevel);
  setCookie('blur', blurNsfw);
  setCookie('nsfw', showNsfw);
}

export function BrowsingModeProvider({ children }: { children: React.ReactNode }) {
  const queryUtils = trpc.useContext();
  const { status } = useSession();
  const { data } = useSession();
  const currentUser = data?.user;
  const debouncer = useDebouncer(1000);
  const cookies = useCookies();
  const { mutate } = trpc.user.update.useMutation();
  const [store, setStore] = useState(createBrowsingModeStore(getStoreInitialValues()));

  function getStoreInitialValues() {
    return !currentUser
      ? { showNsfw: false, blurNsfw: true, browsingLevel: 0 }
      : {
          showNsfw: cookies.showNsfw ?? currentUser.showNsfw,
          blurNsfw: cookies.blurNsfw ?? currentUser.blurNsfw,
          browsingLevel: cookies.browsingLevel ?? currentUser.browsingLevel,
        };
  }

  useDidUpdate(() => {
    if (status === 'authenticated' && currentUser) {
      setStore(createBrowsingModeStore(getStoreInitialValues()));
    }
  }, [currentUser, status]);

  // update the cookie to reflect the browsingLevel state of the current tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (store && document.visibilityState === 'visible') updateCookieValues(store.getState());
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [store]);

  useEffect(() => {
    if (store && currentUser) {
      return store.subscribe((state) => {
        updateCookieValues(state);
        if (currentUser)
          debouncer(() => {
            mutate({ id: currentUser.id, ...state });
            invalidateModeratedContent(queryUtils);
          });
      });
    }
  }, [store, currentUser]);

  return <BrowsingModeCtx.Provider value={store}>{children}</BrowsingModeCtx.Provider>;
}

/** returns the user selected browsing level or the system default browsing level */
export function useBrowsingLevel() {
  const { data } = useSession();
  const currentUser = data?.user;
  const { useStore } = useBrowsingModeContext();
  const browsingLevel = useStore((x) => x.browsingLevel);
  if (!currentUser) return publicBrowsingLevelsFlag;
  return !browsingLevel ? publicBrowsingLevelsFlag : browsingLevel;
}

export function useIsPublicBrowsingLevel() {
  const level = useBrowsingLevel();
  return getIsPublicBrowsingLevel(level);
}

export function useIsBrowsingLevelSelected(level: BrowsingLevel) {
  const { useStore } = useBrowsingModeContext();
  const browsingLevel = useStore((x) => x.browsingLevel);
  return Flags.hasFlag(browsingLevel, level);
}
