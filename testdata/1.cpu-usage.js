import { check, sleep } from "k6";
import remote from "k6/x/remotewrite";

export let options = {
  iterations: 500,
  vus: 1,
  thresholds: {
    http_req_failed: ['rate<0.01']
  }
};

const client = new remote.Client({
  url: "http://localhost:9090/api/v1/write",
  timeout: "30s"
});

export default function () {
  sendMetricData("server1", Math.floor(Math.random() * 21) + 80);
  sleep(0.1); // Add 100ms delay between requests
}

function sendMetricData(instanceValue, value) {
  const res = client.store([
    {
      labels: [
        { name: "__name__", value: "cpu_usage" },
        { name: "job", value: "exporter" },
        { name: "instance", value: instanceValue },
      ],
      samples: [{ value: value }],
    },
  ]);
  check(res, {
    "is status 204": (r) => r.status === 204,
  });
  if (res.status !== 204) {
    console.log(`Failed request: ${res.status} - ${res.body}`);
  }
}
