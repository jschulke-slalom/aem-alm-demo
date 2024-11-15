import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  console.log('Created <ul> element');

  [...block.children].forEach((row, rowIndex) => {
    console.log(`Processing row ${rowIndex}`);
    const li = document.createElement('li');
    // Add click event listener to toggle the 'flip' class
    li.addEventListener('click', () => {
      li.classList.toggle('flip');
    });
    moveInstrumentation(row, li);
    while (row.firstElementChild) {
      li.append(row.firstElementChild);
      console.log('Appended child element to <li>');
    }
    const divs = [...li.children];
    console.log(`Number of div children in <li>: ${divs.length}`);

    divs.forEach((div, index) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
        console.log(`Div ${index} is an image, assigned class "cards-card-image"`);
      } else if (divs.length === 3 && index === 1) {
        div.className = 'cards-card-title';
        console.log(`Div ${index} is a title, assigned class "cards-card-title"`);
      } else {
        div.className = 'cards-card-body';
        console.log(`Div ${index} is a body, assigned class "cards-card-body"`);
      }
    });

    ul.append(li);
    console.log('Appended <li> to <ul>');
  });
  block.textContent = '';
  block.append(ul);
}
