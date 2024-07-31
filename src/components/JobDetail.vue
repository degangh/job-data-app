<template>
  <div class="bg-gray-100 min-h-screen py-8">
    <div class="container mx-auto px-4 max-w-3xl">
      <button @click="goBack" class="mb-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
        ← Go Back
      </button>
      
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading job details...</p>
      </div>
      
      <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
        <p class="font-bold">Error</p>
        <p>{{ error }}</p>
      </div>
      
      <div v-else class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="p-6">
          <h1 class="text-3xl font-bold mb-4 text-gray-800">{{ job.job_title }}</h1>
          <div class="space-y-3">
            <p><span class="font-semibold text-gray-600">Location:</span> {{ job.job_location }}</p>
            <p><span class="font-semibold text-gray-600">Salary:</span> <span v-if="job.salary !== null">{{ job.salary }}</span></p>
            <p><span class="font-semibold text-gray-600">Relevance to PHP:</span> {{ job.relevance_to_php_developer }}</p>
            <p><span class="font-semibold text-gray-600">Posted Date:</span> {{ formattedDate }}</p>
            <p><span class="font-semibold text-gray-600">URL:</span> 
              <a :href="job.url" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">{{ job.url }}</a>
            </p>
          </div>
        </div>
        
        <div class="bg-gray-50 p-6">
          <h2 class="text-2xl font-semibold mb-4 text-gray-800">Requirements</h2>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li v-for="requirement in job.requirements" :key="requirement">{{ requirement }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '../api/axios';
import moment from 'moment';

export default {
  data() {
    return {
      job: {},
      loading: true,
      error: null,
    };
  },
  computed: {
    formattedDate() {
      return this.job.post_date ? moment(this.job.post_date).format('DD/MM/YYYY') : '';
    }
  },
  async created() {
    await this.fetchJob();
  },
  methods: {
    async fetchJob() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiClient.get(`/jobs/${this.$route.params.id}`);
        this.job = response.data;
      } catch (error) {
        console.error(error);
        this.error = "Failed to load job details. Please try again later.";
      } finally {
        this.loading = false;
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  },
};
</script>