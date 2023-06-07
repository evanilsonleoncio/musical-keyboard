const showSharpCypher = document.querySelector('.header-controls div:nth-child(2)');
const showFlatCypher = document.querySelector('.header-controls div:nth-child(3)');

const cypherSet = document.querySelectorAll('.cypher');

showSharpCypher.addEventListener('click', () => {
	cypherSet.forEach((cs) => {
		cs.classList.toggle('show-cypher');
		cs.classList.toggle('show-sharp-cypher');

		if (cs.classList.contains('show-flat-cypher')) {
			cs.classList.remove('show-flat-cypher');
			cs.classList.toggle('show-cypher');
		};
	});
});

showFlatCypher.addEventListener('click', () => {
	cypherSet.forEach((cs) => {
		cs.classList.toggle('show-cypher');
		cs.classList.toggle('show-flat-cypher');

		if (cs.classList.contains('show-sharp-cypher')) {
			cs.classList.remove('show-sharp-cypher');
			cs.classList.toggle('show-cypher');
		};
	});
});

//

const showKeymap = document.querySelector('.header-controls div:nth-child(4)');

showKeymap.addEventListener('click', () => {
	const whiteKeyLetters = document.querySelectorAll('.white-key-letter');
	const sharpKeyLetters = document.querySelectorAll('.sharp-key-letter');

	whiteKeyLetters.forEach((wkl) => {
			wkl.classList.toggle('show-letter');
	});

	sharpKeyLetters.forEach((skl) => {
		skl.classList.toggle('show-letter');
	});
});

//

const lightSwitch = document.querySelector('.header-controls div:nth-child(5)');
const darkMode = document.querySelector('.header-controls div:nth-child(1)');
const mainFrame = document.querySelector('.frame');

lightSwitch.addEventListener('click', () => {
	darkMode.classList.toggle('active');

	if (darkMode.classList.contains('active')) {
		setTimeout(() => {
			lightSwitch.querySelector('img').src = 'images/sun.png';
		}, 10);
	} else {
		setTimeout(() => {
			lightSwitch.querySelector('img').src = 'images/moon.png';
		}, 900);
	};

	mainFrame.classList.toggle('dark');
});

//

const currentInstrumentDisplayName = document.querySelector('.current-instrument-container span');
const currentInstrumentImage = document.querySelector('.current-instrument-container img');
let currentInstrument = 'piano';

const instrumentSet = document.querySelectorAll('.menu-buttons button');

instrumentSet.forEach((button) => {
	button.addEventListener('mousedown', () => {
		button.classList.add('active');
		currentInstrument = button.textContent.toLowerCase();

		if (currentInstrument == 'sax') {
			currentInstrumentImage.src = `images/${currentInstrument}ophone.png`;
			currentInstrumentDisplayName.textContent = button.textContent + 'ophone';
		} else {
			currentInstrumentImage.src = `images/${currentInstrument}.png`;
			currentInstrumentDisplayName.textContent = button.textContent;
		};
	});

	button.addEventListener('mouseup', () => {
		button.classList.remove('active');
	});

	button.addEventListener('mouseleave', () => {
		button.classList.remove('active');
	});
});

//

const keyInteractionEnter = (pressedKey) => {
	if (pressedKey.classList.contains('sharp-key')) {
		pressedKey.classList.add('active');
		pressedKey.firstChild.classList.add('active');
		pressedKey.firstChild.firstChild.classList.add('active');
		pressedKey.firstChild.firstChild.nextSibling.classList.add('active');
		pressedKey.firstChild.lastChild.classList.add('active');
		pressedKey.lastChild.classList.add('active');
	} else if (pressedKey.classList.contains('white-key')) {
		pressedKey.classList.add('pressed');
	};
};

const keyInteractionLeave = (pressedKey) => {
	if (pressedKey.classList.contains('sharp-key')) {
		pressedKey.classList.remove('active');
		pressedKey.firstChild.classList.remove('active');
		pressedKey.firstChild.firstChild.classList.remove('active');
		pressedKey.firstChild.firstChild.nextSibling.classList.remove('active');
		pressedKey.firstChild.lastChild.classList.remove('active');
		pressedKey.lastChild.classList.remove('active');
	} else if (pressedKey.classList.contains('white-key')) {
		pressedKey.classList.remove('pressed');
	};
};

//

const playNote = (note) => {
	audio = new Audio(`sounds/${currentInstrument}/${note}.wav`);
	audio.play();
	return audio;
};

//

let currentAudio = null;
let fadeOutEffect = null;

const fadeOutAudio = () => {
	if (currentAudio !== null) {
		let volume = currentAudio.volume;
		volume -= 0.005;

		if (volume < 0) {
			clearInterval(fadeOutEffect);
			currentAudio.pause();
			currentAudio.currentTime = 0;
			currentAudio.volume = 1;
			currentAudio = null;
		} else {
			currentAudio.volume = volume;
		};
	};
};

//

const keySet = document.querySelectorAll('.key');

keySet.forEach((key) => {
	key.addEventListener('mousedown', () => {
		keyInteractionEnter(key);

		if (['sax', 'flute'].includes(currentInstrument)) {
			if (currentAudio !== null && !currentAudio.paused) {
				clearInterval(fadeOutEffect);
				currentAudio.pause();
				currentAudio.currentTime = 0;
				currentAudio.volume = 1;
			};
			
			let audio = playNote(key.id);
			currentAudio = audio;
		} else {
			playNote(key.id);
		};
	});

	key.addEventListener('mouseup', () => {
		keyInteractionLeave(key);

		if (['sax', 'flute'].includes(currentInstrument)) {
			if (currentAudio !== null && !currentAudio.paused) {
				fadeOutEffect = setInterval(fadeOutAudio, 10);
			};
		};
	});
});

keySet.forEach((key) => {
	key.addEventListener('mouseenter', (event) => {
		if (event.buttons === 1) {
			keyInteractionEnter(key);

			if (['sax', 'flute'].includes(currentInstrument)) {
				if (currentAudio !== null && !currentAudio.paused) {
					clearInterval(fadeOutEffect);
					currentAudio.pause();
					currentAudio.currentTime = 0;
					currentAudio.volume = 1;
				};

				let audio = playNote(key.id);
				currentAudio = audio;
			} else {
				playNote(key.id)
			};
		};
	});

	key.addEventListener('mouseleave', (event) => {
		if (event.buttons === 1) {
			keyInteractionLeave(key);

			if (['sax', 'flute'].includes(currentInstrument)) {
				if (currentAudio !== null && !currentAudio.paused) {
					fadeOutEffect = setInterval(fadeOutAudio, 10);
				};
			};
		};
	});
});

//

let isKeyDown = false;
let pressedKeySet = new Set();

document.addEventListener('keydown', (event) => {
  const keyLetter = event.key.toUpperCase();

  if (/^[a-zA-Z0-9]$/.test(event.key) && !pressedKeySet.has(keyLetter)) {
    if (['sax', 'flute'].includes(currentInstrument)) {
      if (currentAudio !== null && !currentAudio.paused) {
        clearInterval(fadeOutEffect);
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.volume = 1;
      };

      let audio = playNote(keyLetter);
      currentAudio = audio;
    } else {
      playNote(keyLetter);
    };

    keySet.forEach((key) => {
      if (key.id == keyLetter) {
        keyInteractionEnter(key);
      };
    });

    pressedKeySet.add(keyLetter);
    isKeyDown = true;
  };
});

document.addEventListener('keyup', (event) => {
  if (/^[a-zA-Z0-9]$/.test(event.key)) {
    const keyLetter = event.key.toUpperCase();

    if (pressedKeySet.has(keyLetter)) {
      if (['sax', 'flute'].includes(currentInstrument) && isKeyDown) {
        if (currentAudio !== null && !currentAudio.paused) {
          fadeOutEffect = setInterval(fadeOutAudio, 10);
        };
      };

      keySet.forEach((key) => {
        if (key.id == keyLetter) {
          keyInteractionLeave(key);
        };
      });

      pressedKeySet.delete(keyLetter);
    };
  };

  isKeyDown = false;
});