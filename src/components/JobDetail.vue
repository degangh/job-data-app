<template>
    <div class="container mx-auto p-4">
      <div v-if="loading" class="text-center">Loading...</div>
      <div v-else>
        <h1 class="text-2xl font-bold mb-4">{{ job.job_title }}</h1>
        <p><strong>Location:</strong> {{ job.job_location }}</p>
        <p><strong>Salary:</strong> <span v-if="job.salary !== null">${{ job.salary }}</span></p>
        <p><strong>Relevance to PHP:</strong> {{ job.relevance_to_php_developer }}</p>
        <p><strong>Posted Date:</strong> {{ new Date(job.posted_date).toLocaleDateString() }}</p>
        <p><strong>URL:</strong> <a :href="job.url" class="text-blue-500">{{ job.url }}</a></p>
        <h2 class="text-xl font-semibold mt-4">Requirements</h2>
        <ul class="list-disc list-inside">
          <li v-for="requirement in job.requirements" :key="requirement">{{ requirement }}</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        job: {},
        loading: true,
      };
    },
    async created() {
      await this.fetchJob();
    },
    methods: {
      async fetchJob() {
        this.loading = true;
        try {
          const response = await axios.get(`http://192.168.56.56:5000/api/jobs/${this.$route.params.id}`);
          this.job = response.data;
        } catch (error) {
          console.error(error);
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
  }
  </style>
  