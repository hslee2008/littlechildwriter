<template>
  <div>
    <LibrisUsers :limit="false" />
    <Bar :chart-options="chartOptions" :chart-data="chartData" class="mt-5" />
  </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { db } from 'plugins/firebase'

const userBookNumber = ref<any>([])
const userLabels = ref<string[]>([])
const userUID = ref<string[]>([])

const chartOptions = ref<any>({
  type: 'line',
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: '사용자별 업로드 수'
    }
  }
})

const chartData = ref<any>({
  labels: userLabels.value,
  datasets: [
    {
      label: '업로드 수',
      data: userBookNumber,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
    }
  ]
})

onMounted(() => {
  db.ref('users')
    .orderByChild('libris')
    .on('value', async s => {
      const data = s.val()
      for (const [key] of Object.entries(data)) {
        if (!data[key].displayName) continue

        userUID.value.push(key)
        userLabels.value.push(data[key].displayName)
      }
    })

  db.ref('contents').on('value', async s => {
    const data = s.val()
    for (const [key] of Object.entries(data)) {
      const index = userUID.value.indexOf(data[key].uid)
      if (index === -1) continue

      if (userBookNumber.value[index]) userBookNumber.value[index] += 1
      else userBookNumber.value[index] = 1
    }
  })
})

useHead({
  title: '명예의 전당 - LCW'
})
</script>
