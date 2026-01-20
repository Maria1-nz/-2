AFRAME.registerComponent('click-handler', {
  init: function() {
    const el = this.el;
    const originalColor = el.getAttribute('color');
    const originalScale = el.getAttribute('scale');

    el.setAttribute('data-original-color', originalColor);
    el.setAttribute('data-original-scale', JSON.stringify(originalScale));

    // Эффекты наведение/уход
    el.addEventListener('mouseenter', function() {
      if (el.getAttribute('visible') === 'false') return;
      el.setAttribute('scale', {
        x: originalScale.x * 1.2,
        y: originalScale.y * 1.2,
        z: originalScale.z * 1.2
      });
      el.setAttribute('color', '#8c00ff');
    });

    el.addEventListener('mouseclick', function() {
      if (el.getAttribute('visible') === 'false') return;
      const origScale = JSON.parse(el.getAttribute('data-original-scale'));
      el.setAttribute('scale', origScale);
      el.setAttribute('color', originalColor);
    });

    // Обработчик клика
    el.addEventListener('click', function(event) {
      if (!window.gameActive || el.getAttribute('visible') === 'false') return;

      // 1. Звук сбора
      const collectSound = document.querySelector('#collectSound');
      if (collectSound && collectSound.components) {
        collectSound.components.sound.playSound();
      }

      // 2. Анимация исчезновения (масштаб + прозрачность)
      el.setAttribute('animation', [
        {
          property: 'scale',
          to: '0 0 0',
          dur: 300,
          easing: 'easeInQuad'
        },
        {
          property: 'opacity',
          to: '0',
          dur: 300,
          easing: 'easeInQuad'
        }
      ]);


      // 4. Скрываем объект сразу (на случай сбоев анимации)
      el.setAttribute('visible', 'false');

      // 5. Увеличиваем счёт
        if (typeof window.collectedObjects !== 'undefined') {
            window.collectedObjects++;
             console.log('Счётчик:', window.collectedObjects);


      // 6. Обновляем интерфейс
      updateUI();

      // 7. Проверяем победу
      if (window.collectedCount >= window.totalObjects) {
        endGame(true);
      }

      event.stopPropagation();}
    });
  }
});