(function () {
  'use strict';

  /** Fisher–Yates shuffle (in place, returns same array). */
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function paragraphContainsImage(paragraph) {
    return paragraph.querySelector('img') !== null;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const content = document.getElementById('content');
    const addButton = document.getElementById('add-paragraphs');
    if (!content || !addButton) {
      return;
    }

    const originalParagraphs = Array.from(content.querySelectorAll('p')).slice(0, 3);
    let imageParagraphsHidden = false;

    function applyImageVisibility(paragraph) {
      if (imageParagraphsHidden && paragraphContainsImage(paragraph)) {
        paragraph.classList.add('is-hidden');
      }
    }

    function insertSeparators() {
      content.querySelectorAll('hr.paragraph-separator').forEach(function (hr) {
        hr.remove();
      });

      const paragraphs = Array.from(content.querySelectorAll('p'));
      for (let i = 0; i < paragraphs.length; i += 2) {
        const hasFollowing = i + 2 < paragraphs.length;
        if (hasFollowing) {
          const hr = document.createElement('hr');
          hr.className = 'paragraph-separator';
          paragraphs[i + 1].insertAdjacentElement('afterend', hr);
        }
      }
    }

    addButton.addEventListener('click', function () {
      const clones = originalParagraphs.map(function (p) {
        return p.cloneNode(true);
      });
      shuffle(clones).forEach(function (clone) {
        applyImageVisibility(clone);
        const paragraphs = content.querySelectorAll('p');
        const lastP = paragraphs[paragraphs.length - 1];
        lastP.insertAdjacentElement('afterend', clone);
      });
      insertSeparators();
    });

    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.textContent = 'Toggle image paragraphs';
    toggleButton.id = 'toggle-image-paragraphs';
    addButton.insertAdjacentElement('afterend', toggleButton);

    toggleButton.addEventListener('click', function () {
      imageParagraphsHidden = !imageParagraphsHidden;
      content.querySelectorAll('p').forEach(function (p) {
        if (!paragraphContainsImage(p)) {
          return;
        }
        if (imageParagraphsHidden) {
          p.classList.add('is-hidden');
        } else {
          p.classList.remove('is-hidden');
        }
      });
      insertSeparators();
    });

    insertSeparators();
  });
})();
