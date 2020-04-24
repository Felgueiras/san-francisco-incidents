export default function SanFranciscoAPI() {
  const endpoint = "https://e38b567c.ngrok.io/api";
  return {
    neighborhoods() {
      return fetch(`${endpoint}/neighborhoods`).then((res) => res.json());
    },
    classification() {
      return fetch(`${endpoint}/classification`).then((res) => res.json());
    },
    classificationCustom(neighborhood, date, period) {
      return fetch(
        `${endpoint}/classification/neighborhood/${neighborhood}/date/${date}/period/${period}`
      ).then((res) => res.json());
    },
    regressionCustom(neighborhood, date, period) {
      return fetch(
        `${endpoint}/regression/neighborhood/${neighborhood}/date/${date}/period/${period}`
      ).then((res) => res.json());
    },
  };
}
