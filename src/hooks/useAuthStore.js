import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { fetchMe, googleLoginUrl, patchMe, completeOnboarding } from '../lib/api'
import { setToken, getToken } from '../lib/axios'

/**
 * Auth store — JWT-backed, hydrated from /api/auth/me on boot.
 *
 * State is persisted to localStorage so the UI knows the user is signed in
 * before the network round-trip finishes. On mount we kick off `hydrate()`
 * which revalidates against /me in the background — if it fails (e.g. token
 * expired), we clear the persisted state and bounce the user back to signed-
 * out.
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      needsOnboarding: false,
      ready: false,

      savedScripts: [],
      followedHubs: [],
      unreadCount: 0,

      /** Background revalidate /me. UI already shows cached state via persist. */
      hydrate: async () => {
        if (!getToken()) {
          set({
            user: null,
            isAuthenticated: false,
            needsOnboarding: false,
            savedScripts: [],
            followedHubs: [],
            unreadCount: 0,
            ready: true,
          })
          return
        }
        try {
          const me = await fetchMe()
          set({
            user: me,
            isAuthenticated: true,
            needsOnboarding: !me.username,
            savedScripts: me.savedScripts || [],
            followedHubs: me.followedHubs || [],
            unreadCount: me.unreadCount || 0,
            ready: true,
          })
        } catch {
          setToken(null)
          set({
            user: null,
            isAuthenticated: false,
            needsOnboarding: false,
            savedScripts: [],
            followedHubs: [],
            unreadCount: 0,
            ready: true,
          })
        }
      },

      /** Persist a JWT received from the OAuth callback and load /me. */
      setTokenAndHydrate: async (token) => {
        setToken(token)
        await get().hydrate()
      },

      /** Kick off Google OAuth. */
      signIn: () => {
        window.location.href = googleLoginUrl()
      },

      signOut: () => {
        setToken(null)
        set({
          user: null,
          isAuthenticated: false,
          needsOnboarding: false,
          savedScripts: [],
          followedHubs: [],
          unreadCount: 0,
        })
      },

      /** Called by OnboardingModal after the /onboarding mutation succeeds. */
      applyUser: (user) => {
        set({
          user,
          isAuthenticated: true,
          needsOnboarding: !user.username,
        })
      },

      /** Submit onboarding details to the backend and apply the returned user. */
      completeOnboarding: async (data) => {
        const user = await completeOnboarding(data)
        set({ user, isAuthenticated: true, needsOnboarding: !user.username })
        return user
      },

      /** Update profile fields via PATCH /api/auth/me. */
      updateProfile: async (data) => {
        const user = await patchMe(data)
        set({ user })
        return user
      },

      /** Optimistic helpers used by mutation hooks. */
      setSavedScripts: (ids) => set({ savedScripts: ids }),
      setFollowedHubs: (ids) => set({ followedHubs: ids }),
      setUnreadCount: (n) => set({ unreadCount: n }),

      isScriptSaved: (scriptId) => get().savedScripts.includes(scriptId),
      isHubFollowed: (hubId) => get().followedHubs.includes(hubId),
      isAdmin: () => {
        const role = get().user?.role
        return role === 'admin' || role === 'moderator'
      },
    }),
    {
      name: 'eclipse-auth',
      storage: createJSONStorage(() => localStorage),
      // `ready` is intentionally NOT persisted — it must reset to false on
      // every page load so consumers can distinguish "boot cache" from
      // "server-confirmed". `hydrate()` flips it to true once /me settles.
      partialize: (s) => ({
        user: s.user,
        isAuthenticated: s.isAuthenticated,
        needsOnboarding: s.needsOnboarding,
        savedScripts: s.savedScripts,
        followedHubs: s.followedHubs,
        unreadCount: s.unreadCount,
      }),
    }
  )
)
