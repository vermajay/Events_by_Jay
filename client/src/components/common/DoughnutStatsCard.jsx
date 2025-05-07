import { Chart, registerables } from "chart.js"
import { Doughnut } from "react-chartjs-2"

Chart.register(...registerables)

const DoughnutStatsCard = ({title, data}) => {

  const labels = data.map(item => item.label)
  const values = data.map(item => item.value)
  const backgroundColors = data.map(item => item.color)

  const chartData = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: backgroundColors,
      hoverOffset: 4,
      borderWidth: 1,
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          boxWidth: 15,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          }
        }
      }
    }
  }

  return (
    <div className="max-w-[400px]">
      <h3 className="text-lg text-center font-medium text-gray-900">{title}</h3>
      <div className="w-full h-[400px] p-4">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  )
}

export default DoughnutStatsCard