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
    }
    const divs = [...li.children];
    divs.forEach((div, index) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else if (divs.length === 3 && index === 1) {
        div.className = 'cards-card-title';
      } else {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
