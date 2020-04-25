export default function SanFranciscoAPI() {
  const endpoint = "https://527696d4.ngrok.io/api";
  return {
    neighborhoods() {
      return fetch(`${endpoint}/neighborhoods`).then((res) => res.json());
    },
    predictions() {
      return fetch(`${endpoint}/predictions`).then((res) => res.json());
    },
    predictionDate(date, period) {
      return fetch(
        `${endpoint}/predictions/date/${date}/period/${period}`
      ).then((res) => res.json());
    },
  };
}
