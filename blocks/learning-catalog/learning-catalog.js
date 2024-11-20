import { API_URL } from '../../constants/index.js';
import { apiCall } from '../../scripts/authService.js';

async function fetchData() {
  try {
    const response = await apiCall(`${API_URL}learningObjects`); // ?filter.catalogIds=186175
    console.log(response);
    return response.data; // Return the 'data' part of the response
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

const getLearningObjectMarkup = (data) => {
  const markup = `
  <div class="cards">
    <ul>
    ${data.map((lo) => {
    const { overview } = lo.attributes.localizedMetadata[0];
    const trimmedOverview = overview.length > 200 ? `${overview.slice(0, 200)}...` : overview;
    return `
        <li class="learning-object">
          <div clas="cards-card-image"><img src="${lo.attributes.imageUrl}" alt="${lo.attributes.localizedMetadata[0].name}" /></div>
          <div class="cards-card-body">
          <h3>${lo.attributes.localizedMetadata[0].name}</h3>
          <p>${trimmedOverview}</p>
          <p>Duration: ${Math.floor(lo.attributes.duration / 60) || 'N/A'} minutes</p> 
          ${lo.id}
          </div>
        </li>
      `;
  }).join('')}
    </div>
  `;
  return markup;
};

export default async function decorate(block) {
  const items = await fetchData();

  // Ensure items is an array
  if (!Array.isArray(items)) {
    console.error('Expected an array, but got:', items);
    return;
  }

  const markup = getLearningObjectMarkup(items);
  block.querySelector('div').insertAdjacentHTML('beforeend', markup);
}
