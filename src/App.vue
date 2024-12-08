<template>
  <div class="min-h-screen bg-gray-100">
    <nav v-if="user" class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold">Job List</h1>
          </div>
          <div class="flex items-center">
            <button
              @click="handleLogout"
              class="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { supabase } from './config/supabase'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const router = useRouter()
    const user = ref(null)

    const handleLogout = async () => {
      await supabase.auth.signOut()
      localStorage.removeItem('user')
      localStorage.removeItem('session')
      router.push('/login')
    }

    onMounted(() => {
      // Set initial user state
      const session = JSON.parse(localStorage.getItem('session'))
      if (session) {
        user.value = session.user
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
          user.value = session.user
        } else if (event === 'SIGNED_OUT') {
          user.value = null
          router.push('/login')
        }
      })
    })

    return {
      user,
      handleLogout
    }
  }
}
</script>
  
  <style>
  </style>
  