// This section controls enabling/disabling of cyphers
const showSharpCypher = document.querySelector(`.header-controls div:nth-child(2)`);
const showFlatCypher = document.querySelector(`.header-controls div:nth-child(3)`);

const whiteKeyCypherSet = document.querySelectorAll(`.white-key-cypher`);
const blackKeyCypherSet = document.querySelectorAll(`.bkc`);

showSharpCypher.addEventListener(`click`, () => {
	if (blackKeyCypherSet[0].classList.contains(`show-flat-cypher`)) {
		whiteKeyCypherSet.forEach((wkc) => {
			wkc.classList.add(`show-cypher`);
		});
	} else {
		whiteKeyCypherSet.forEach((wkc) => {
			wkc.classList.toggle(`show-cypher`);
		});
	};

	blackKeyCypherSet.forEach((bk) => {
		const isSharpCyphersEnabled =	bk.classList.toggle(`show-sharp-cypher`);

		if (bk.classList.contains(`show-flat-cypher`)) {
			bk.classList.remove(`show-flat-cypher`);
		};

		localStorage.setItem(`sharpKeyEnabled`, isSharpCyphersEnabled);
		localStorage.removeItem(`flatKeyEnabled`);
	});
});

showFlatCypher.addEventListener(`click`, () => {
	if (blackKeyCypherSet[0].classList.contains(`show-sharp-cypher`)) {
		whiteKeyCypherSet.forEach((wkc) => {
			wkc.classList.add(`show-cypher`);
		});
	} else {
		whiteKeyCypherSet.forEach((wkc) => {
			wkc.classList.toggle(`show-cypher`);
		});
	};

	blackKeyCypherSet.forEach((bk) => {
		const isFlatCyphersEnabled = bk.classList.toggle(`show-flat-cypher`);

		if (bk.classList.contains(`show-sharp-cypher`)) {
			bk.classList.remove(`show-sharp-cypher`);
		};

		localStorage.setItem(`flatKeyEnabled`, isFlatCyphersEnabled);
		localStorage.removeItem(`sharpKeyEnabled`);
	});
});

// This section controls enabling/disabling of the keymap
const showKeymap = document.querySelector(`.header-controls div:nth-child(4)`);
const whiteKeyLetters = document.querySelectorAll(`.white-key-letter`);
const blackKeyLetters = document.querySelectorAll(`.black-key-letter`);

let isWhiteKeymapEnabled = false;
let isBlackKeymapEnabled = false;

showKeymap.addEventListener(`click`, () => {
	whiteKeyLetters.forEach((wkl) => {
		wkl.classList.toggle(`show-letter`);
	});

	isWhiteKeymapEnabled = Array.from(whiteKeyLetters).some((wkl) => wkl.classList.contains(`show-letter`));

	localStorage.setItem(`whiteKeymapEnabled`, isWhiteKeymapEnabled);

	blackKeyLetters.forEach((bkl) => {
		bkl.classList.toggle(`show-letter`);
	});

	isBlackKeymapEnabled = Array.from(blackKeyLetters).some((bkl) => bkl.classList.contains(`show-letter`));

	localStorage.setItem(`blackKeymapEnabled`, isBlackKeymapEnabled);
});

// This section controls enabling/disabling dark mode
const htmlBackground = document.querySelector(`html`);
const lightSwitch = document.querySelector(`.header-controls div:nth-child(5)`);
const darknessExpansion = document.querySelector(`.header-controls div:nth-child(1)`);
const mainFrame = document.querySelector(`.frame`);

let backgroundTimeoutId;

lightSwitch.addEventListener(`click`, () => {
  const isDarknessEnabled = darknessExpansion.classList.toggle(`active`);

  clearTimeout(backgroundTimeoutId);

  if (darknessExpansion.classList.contains(`active`)) {
		setTimeout(() => {
			lightSwitch.querySelector(`img`).src = `images/sun.png`;
		}, 10);

    backgroundTimeoutId = setTimeout(()=> {
      htmlBackground.classList.add(`dark`);
    }, 2000);

		mainFrame.classList.add(`dark`);
	} else {
		setTimeout(() => {
			lightSwitch.querySelector(`img`).src = `images/moon.png`;
		}, 900);

    htmlBackground.classList.remove(`dark`);
		mainFrame.classList.remove(`dark`);
	};

  localStorage.setItem(`darkMode`, isDarknessEnabled);
});

// This section controls the switching of the musical instrument
const currentInstrumentImage = document.querySelector(`.current-instrument-container img`);
const currentInstrumentDisplayName = document.querySelector(`.current-instrument-container span`);
const instrumentSet = document.querySelectorAll(`.menu-buttons button`);

let currentInstrument = `piano`;

instrumentSet.forEach((button) => {
	button.addEventListener(`mousedown`, () => {
		button.classList.add(`active`);
		currentInstrument = button.textContent.toLowerCase();

		localStorage.setItem(`currentInstrument`, currentInstrument);

		if (currentInstrument == `sax`) {
			currentInstrumentImage.src = `images/${currentInstrument}ophone.png`;
			currentInstrumentDisplayName.textContent = button.textContent + `ophone`;
		} else {
			currentInstrumentImage.src = `images/${currentInstrument}.png`;
			currentInstrumentDisplayName.textContent = button.textContent;
		};
	});

	button.addEventListener(`mouseup`, () => {
		button.classList.remove(`active`);
	});

	button.addEventListener(`mouseleave`, () => {
		button.classList.remove(`active`);
	});
});

// This section controls keystroke effects
const keyInteractionEnter = (pressedKey) => {
	if (pressedKey.classList.contains(`black-key`)) {
		pressedKey.classList.add(`active`);
		pressedKey.firstChild.classList.add(`active`);
		pressedKey.firstChild.firstChild.classList.add(`active`);
		pressedKey.firstChild.firstChild.nextSibling.classList.add(`active`);
		pressedKey.firstChild.lastChild.classList.add(`active`);
		pressedKey.lastChild.classList.add(`active`);
	} else if (pressedKey.classList.contains(`white-key`)) {
		pressedKey.classList.add(`active`);
	};
};

const keyInteractionLeave = (pressedKey) => {
	if (pressedKey.classList.contains(`black-key`)) {
		pressedKey.classList.remove(`active`);
		pressedKey.firstChild.classList.remove(`active`);
		pressedKey.firstChild.firstChild.classList.remove(`active`);
		pressedKey.firstChild.firstChild.nextSibling.classList.remove(`active`);
		pressedKey.firstChild.lastChild.classList.remove(`active`);
		pressedKey.lastChild.classList.remove(`active`);
	} else if (pressedKey.classList.contains(`white-key`)) {
		pressedKey.classList.remove(`active`);
	};
};

// This section creates the sound playback function
const playNote = (note) => {
	audio = new Audio(`sounds/${currentInstrument}/${note}.wav`);
	audio.play();
	return audio;
};

// This section creates the sound attenuation effect
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

// This section activates the reproduction of the sound when pressing the virtual keyboard key with the mouse
const keySet = document.querySelectorAll(`.key`);

keySet.forEach((key) => {
	key.addEventListener(`mousedown`, () => {
		keyInteractionEnter(key);

		if ([`sax`, `flute`].includes(currentInstrument)) {
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

	key.addEventListener(`mouseup`, () => {
		keyInteractionLeave(key);

		if ([`sax`, `flute`].includes(currentInstrument)) {
			if (currentAudio !== null && !currentAudio.paused) {
				fadeOutEffect = setInterval(fadeOutAudio, 10);
			};
		};
	});
});

keySet.forEach((key) => {
	key.addEventListener(`mouseenter`, (event) => {
		if (event.buttons === 1) {
			keyInteractionEnter(key);

			if ([`sax`, `flute`].includes(currentInstrument)) {
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

	key.addEventListener(`mouseleave`, (event) => {
		if (event.buttons === 1) {
			keyInteractionLeave(key);

			if ([`sax`, `flute`].includes(currentInstrument)) {
				if (currentAudio !== null && !currentAudio.paused) {
					fadeOutEffect = setInterval(fadeOutAudio, 10);
				};
			};
		};
	});
});

// This section activates the reproduction of the sound when pressing the physical keyboard key
let isKeyDown = false;
let pressedKeySet = new Set();

document.addEventListener(`keydown`, (event) => {
  const keyLetter = event.key.toUpperCase();

  if (/^[a-zA-Z0-9]$/.test(event.key) && !pressedKeySet.has(keyLetter)) {
    if ([`sax`, `flute`].includes(currentInstrument)) {
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

document.addEventListener(`keyup`, (event) => {
  if (/^[a-zA-Z0-9]$/.test(event.key)) {
    const keyLetter = event.key.toUpperCase();

    if (pressedKeySet.has(keyLetter)) {
      if ([`sax`, `flute`].includes(currentInstrument) && isKeyDown) {
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

// This section controls the maintenance of user preferences
window.onload = function () {
	// Checks if cookies have been accepted
  if (!localStorage.getItem(`cookieConsent`)) {
    const cookieConsentBanner = document.querySelector(`.cookie-banner`);
    const cookieConsentButton = document.querySelector(`#cookie-consent`);

    cookieConsentBanner.classList.add(`show`);

    cookieConsentButton.addEventListener(`click`, () => {
      localStorage.setItem(`cookieConsent`, true);
      cookieConsentButton.classList.add(`accepted`);
      cookieConsentButton.textContent = `√`;

      setTimeout(()=> {
        cookieConsentBanner.classList.remove(`show`);
      }, 2000);
    });
  } else {
		// Restores the current state of the cyphers 
		if (localStorage.getItem(`sharpKeyEnabled`) === `true`) {
			blackKeyCypherSet.forEach((bk) => {
				bk.classList.toggle(`show-sharp-cypher`);
			});

			whiteKeyCypherSet.forEach((wkc) => {
				wkc.classList.add(`show-cypher`);
			});
		} else if (localStorage.getItem(`flatKeyEnabled`) === `true`) {
			blackKeyCypherSet.forEach((bk) => {
				bk.classList.toggle(`show-flat-cypher`);
			});

			whiteKeyCypherSet.forEach((wkc) => {
				wkc.classList.add(`show-cypher`);
			});
		};

		// Restores the current state of the keymap
		if (localStorage.getItem(`whiteKeymapEnabled`) === `true`) {
			whiteKeyLetters.forEach((wkl) => {
				wkl.classList.toggle(`show-letter`);
			});
		};

		if (localStorage.getItem(`blackKeymapEnabled`) === `true`) {
			blackKeyLetters.forEach((bkl) => {
				bkl.classList.toggle(`show-letter`);
			});
		};

		// Restores current lighting state
    if (localStorage.getItem(`darkMode`) === `true`) {
      darknessExpansion.classList.toggle(`active`);
      htmlBackground.classList.add(`dark`);
			mainFrame.classList.toggle(`dark`);
    };

		//
		currentInstrument = localStorage.getItem(`currentInstrument`);

		if (currentInstrument == `sax`) {
			currentInstrumentImage.src = `images/${currentInstrument}ophone.png`;
			currentInstrumentDisplayName.textContent = currentInstrument.charAt(0).toUpperCase() + currentInstrument.slice(1) + `ophone`;
		} else {
			currentInstrumentImage.src = `images/${currentInstrument}.png`;
			currentInstrumentDisplayName.textContent = currentInstrument.charAt(0).toUpperCase() + currentInstrument.slice(1);
		};
  };
};