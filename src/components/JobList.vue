<template>
  <div class="bg-gray-100 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Job Listings</h1>

      <div class="mb-6 bg-white p-4 rounded-lg shadow-md">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center">
            <label for="channel" class="mr-3">Channel</label>
            <select 
              id="channel" 
              v-model="channel" 
              @change="applyFilter"
              class="border rounded px-2 py-1"
            >
              <option value="">All</option>
              <option v-for="c in channels" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div class="flex items-center">
            <label for="relevance" class="mr-3">Relevance</label>
            <select 
              id="relevance" 
              v-model="relevance" 
              @change="applyFilter"
              class="border rounded px-2 py-1"
            >
              <option value="">All</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
          <div class="flex items-center">
            <label for="job_location" class="mr-3">Location</label>
            <select 
              id="job_location" 
              v-model="job_location" 
              @change="applyFilter"
              class="border rounded px-2 py-1"
            >
              <option value="">All</option>
              <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
            </select>
          </div>
          <div class="flex items-center">
            <label for="channel" class="mr-3">Total Jobs</label>
            {{ totalJobs }}
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading jobs...</p>
      </div>
      
      <div v-else-if="jobs.length === 0" class="text-center py-12">
        <p class="text-gray-600">No jobs found.</p>
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <div
    v-for="job in jobs"
    :key="job._id"
    class="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105 flex flex-col min-h-[350px]"
  >
    <div class="p-6 pb-3 job-details flex-grow">
      <h2 class="text-xl font-semibold mb-2 text-gray-800">{{ job.job_title }}</h2>
      <p class="text-gray-600 mb-1"><i class="fas fa-map-marker-alt mr-2"></i>{{ job.job_location }}</p>
      <p class="text-gray-600 mb-1">
        <i class="fas fa-dollar-sign mr-2"></i>
        <span v-if="job.salary">{{ job.salary }}</span>
        <span v-else>Salary Not Available</span>
      </p>
      <p class="text-gray-600 mb-1"><i class="fas fa-code mr-2"></i>Relevance: {{ job.relevance_to_search }}</p>
      <p class="text-gray-600 mb-1"><i class="fas fa-star mr-2"></i>Search: {{ job.channel }}</p>
      <p class="text-gray-600 mb-1"><i class="fas fa-globe mr-2"></i>Allow Remote: {{ job.if_remote_possible }}</p>
      <p class="text-gray-600"><i class="fas fa-calendar-alt mr-2"></i>Posted: {{ formatDate(job.post_date) }}</p>
    </div>
    <div class="px-6 pb-6 pt-2 mt-auto">
      <router-link 
        :to="'/job/' + job._id" 
        class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out w-full text-center"
      >
        View Details
      </router-link>
    </div>
  </div>
</div>
      
      <div class="mt-8 flex justify-between items-center">
        <button 
          @click="prevPage" 
          :disabled="page === 1" 
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
        >
          <i class="fas fa-chevron-left mr-2"></i>Previous
        </button>
        <span class="text-gray-600">Page {{ page }} of {{ totalPages }}</span>
        <button 
          @click="nextPage" 
          :disabled="page === totalPages" 
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
        >
          Next<i class="fas fa-chevron-right ml-2"></i>
        </button>
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
      jobs: [],
      loading: true,
      totalPages: 0,
      states: [
        'SA','NSW','VIC','ACT','QLD','WA','TAS','NT'
      ],
      channels: [],
      relevance: '',
      job_location: '',
      channel: '',
      totalJobs: 'loading'
    };
  },
  async created() {
    await this.fetchJobs();
  },
  computed: {
    page: {
      get() {
        return parseInt(this.$route.query.page) || 1;
      },
      set(value) {
        this.updateQuery({ page: value });
      }
    }
  },
  watch: {
    '$route.query': {
      handler: 'fetchJobs',
      immediate: true
    }
  },  
  created() {
  const { relevance, job_location, channel } = this.$route.query;
  this.relevance = relevance || '';
  this.job_location = job_location || '';
  this.channel = channel || '';
  this.fetchJobs();
},
  methods: {
    async fetchJobs() {
      this.loading = true;
      try {
        const params = new URLSearchParams({
          page: this.page,
          relevance: this.relevance,
          job_location: this.job_location,
          channel: this.channel
        });

        const response = await apiClient.get(`/jobs?${params.toString()}`);
        this.jobs = response.data.jobs;
        this.channels = response.data.channels;
        this.totalPages = response.data.totalPages;
        this.totalJobs = response.data.totalJobs;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
      }
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    applyFilter() {
      this.updateQuery({
        relevance: this.relevance,
        job_location: this.job_location,
        channel: this.channel,
        page: 1
      });
    },
    updateQuery(newQuery) {
      this.$router.push({ 
        query: { ...this.$route.query, ...newQuery } 
      });
    }
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

.job-details p {
    display: flex;
    align-items: center;
}

.job-details i {
    width: 20px; /* Fixed width for icons to align uniformly */
    margin-right: 0.5rem; /* Adjust the spacing as needed */
    text-align: center; /* Center align the icons within their fixed width */
}

.text-gray-600 {
    color: #718096; /* Tailwind CSS color for gray-600 */
}

</style>
