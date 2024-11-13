// Assuming you have a div with id 'learning-objects' in your HTML where you want to display the content
const learningObjectsContainer = document.getElementById('learning-objects');

const getAccessToken = () => {
  // Implement your logic to get the access token
  return 'your-access-token';
};

const createLearningObjectElement = (obj) => {
  const li = document.createElement('li');
  li.className = 'col-4 card card__img';

  const imgWrapper = document.createElement('div');
  imgWrapper.className = 'card__img_wrapper';

  const img = document.createElement('img');
  img.src = obj.attributes.imageUrl || 'https://via.placeholder.com/150';
  img.alt = obj.attributes.localizedMetadata0?.name || 'Image';

  const durationSpan = document.createElement('span');
  durationSpan.className = 'duration';
  durationSpan.textContent = `${Math.floor(obj.attributes.duration / 60)} minutes`;

  imgWrapper.appendChild(img);
  imgWrapper.appendChild(durationSpan);

  const h3 = document.createElement('h3');
  const link = document.createElement('a');
  link.href = `/learningObjects/${obj.id}`;
  link.textContent = obj.attributes.localizedMetadata0?.name || 'No Title';
  h3.appendChild(link);

  const viewDetailsLink = document.createElement('a');
  viewDetailsLink.className = 'btn_link';
  viewDetailsLink.href = `/learningObjects/${obj.id}`;
  viewDetailsLink.textContent = 'View Details';

  li.appendChild(imgWrapper);
  li.appendChild(h3);
  li.appendChild(viewDetailsLink);

  return li;
};

const displayLearningObjects = (learningObjects) => {
  const ul = document.createElement('ul');
  ul.className = 'cards__wrapper';

  if (learningObjects.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No available learning objects.';
    ul.appendChild(li);
  } else {
    learningObjects.forEach((obj) => {
      ul.appendChild(createLearningObjectElement(obj));
    });
  }

  learningObjectsContainer.innerHTML = ''; // Clear previous contents
  learningObjectsContainer.appendChild(ul);
};

const fetchData = async () => {
  const token = getAccessToken();
  if (!token) {
    console.error('No access token available');
    return;
  }

  try {
    const enrollmentsResponse = await fetch(
      'https://learningmanager.adobe.com/primeapi/v2/enrollments?userId=me',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const enrollmentData = await enrollmentsResponse.json();
    const enrolledIds = new Set(
      enrollmentData.data.map(
        (enrollment) => enrollment.relationships.learningObject.data.id
      )
    );

    const learningObjectsResponse = await fetch(
      'https://learningmanager.adobe.com/primeapi/v2/learningObjects',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const learningObjectsData = await learningObjectsResponse.json();

    const filteredLearningObjects = learningObjectsData.data.filter(
      (obj) => !enrolledIds.has(obj.id)
    );

    displayLearningObjects(filteredLearningObjects);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Call fetchData to initiate the process
fetchData();