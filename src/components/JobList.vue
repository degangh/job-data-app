<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Job List</h1>
      <div v-if="loading" class="text-center">Loading...</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="job in jobs"
          :key="job._id"
          class="border p-4 rounded shadow"
        >
          <h2 class="text-xl font-semibold">{{ job.job_title }}</h2>
          <p class="text-gray-600">{{ job.job_location }}</p>
          <p class="text-gray-600"><span v-if="job.salary">${{ job.salary }}</span><span v-else>Salary Not Available</span></p>
          <p class="text-gray-600">Relevance to PHP: {{ job.relevance_to_php_developer }}</p>
          <p class="text-gray-600">Posted Date: {{ job.post_date }}</p>
          <router-link :to="'/job/' + job._id" class="text-blue-500">View Details</router-link>
        </div>
      </div>
      <div class="mt-4 flex justify-between">
        <button @click="prevPage" :disabled="page === 1" class="px-4 py-2 bg-gray-200 rounded">Previous</button>
        <button @click="nextPage" :disabled="page === totalPages" class="px-4 py-2 bg-gray-200 rounded">Next</button>
      </div>
    </div>
  </template>
  
  <script>
  import apiClient from '../api/axios';
  
  export default {
    data() {
      return {
        jobs: [],
        loading: true,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
    },
    async created() {
      await this.fetchJobs();
    },
    methods: {
      async fetchJobs() {
        this.loading = true;
        try {
          const response = await apiClient.get(`/jobs?page=${this.page}&limit=${this.limit}`);
          this.jobs = response.data.jobs;
          this.totalPages = response.data.totalPages;
        } catch (error) {
          console.error(error);
        } finally {
          this.loading = false;
        }
      },
      nextPage() {
        if (this.page < this.totalPages) {
          this.page++;
          this.fetchJobs();
        }
      },
      prevPage() {
        if (this.page > 1) {
          this.page--;
          this.fetchJobs();
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
  }
  </style>
  