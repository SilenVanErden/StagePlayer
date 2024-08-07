    // output util
    const output = document.getElementById('output');
    const time = document.getElementById('time');

    const addOutput = function (x) {
      output.innerHTML = output.innerHTML + '<br>' + x;
    }

    //stage player
    const audio = document.getElementById("audio");


    const muteButton = document.querySelector(".muteButton");
    const unmuteButton = document.querySelector(".unmuteButton");    
    
    const volPlusButton = document.querySelector(".volPlusButton");
    const volMinusButton = document.querySelector(".volMinusButton");    
    
    const resetButton = document.querySelector(".resetButton");

    const playButton = document.querySelector(".playButton");
    const pauseButton = document.querySelector(".pauseButton");

    const fadeInButton = document.querySelector(".fadeInButton");
    const fadeHoldButton = document.querySelector(".fadeHoldButton");
    const fadeOutButton = document.querySelector(".fadeOutButton");

    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const volContainer = document.getElementById('vol-container');
    const volBar = document.getElementById('vol-bar');

    const timerText = document.getElementById('timer-text');
    const volText = document.getElementById('volume-text');
    const titleText = document.getElementById('title-text');

    const setButton = document.querySelector('.setButton');

    const box = document.querySelector('box');
    const setContainer = document.getElementById('set-container');

    let fadeInterval;
    let startVolume = 0.5;
    let isSettings = false;


    //Functions
    const mute = function () {                                         //mute   
      muteButton.classList.add("hidden");
      unmuteButton.classList.remove("hidden");
      audio.muted = true;
    };

    const unmute = function () {                                       //unmute
      unmuteButton.classList.add("hidden");
      muteButton.classList.remove("hidden");
      audio.muted = false;
    }

    const formatTime = function (timeInSeconds) {                      //formatTime
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      const seconds = Math.floor(timeInSeconds % 60);

      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');

      return formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
    }

    const refreshTimeDisplays = function () {
      const progress = (audio.currentTime / audio.duration) * 100;   //refreshTimeDisplays
      progressBar.style.width = progress + '%';
      timerText.textContent = formatTime(audio.currentTime);
    }

    const refreshVolumeDisplays = function () {                        //refreshVolumeDisplays
      volBar.style.width = audio.volume * 100 + '%';
      volText.textContent = Math.floor(audio.volume * 100 + 0.5) + '%';
    }

    const reset = function () {                                        //reset
      audio.pause();
      audio.currentTime = 0;
      audio.volume = startVolume;
      unmute();

      pauseButton.classList.add("hidden");
      playButton.classList.remove("hidden");
      clearInterval(fadeInterval);
    }

    const setTimer = function (e) {                                   //setTimer
      const width = this.clientWidth;
      const clickX = e.offsetX;
      const duration = audio.duration;
      audio.currentTime = (clickX / width) * duration;
    }

    const setVolumeByClick = function (e) {                           //setVolumeByClick
      const width = this.clientWidth;
      const clickX = e.offsetX;
      audio.volume = (clickX / width);
    }

    const play = function () {                                         //play
      playButton.classList.add("hidden");
      pauseButton.classList.remove("hidden");
      audio.play();
    }

    const pause = function () {                                        //pause
      pauseButton.classList.add("hidden");
      playButton.classList.remove("hidden");
      audio.pause();
      clearInterval(fadeInterval);
    }

    const fadeIn = function () {                                      //fadeIn
      if (audio.paused) {
        audio.volume = 0;
      }
      play();

      // Stoppe vorherige Fade-Intervalle, falls vorhanden
      clearInterval(fadeInterval);

      fadeInterval = setInterval(() => {
        if (audio.volume < 1) {
          increaseVolume();
        } else {
          // Stoppe das Intervall
          clearInterval(fadeInterval);
        }
      }, 100); // Erhöhe die Lautstärke alle 200 Millisekunden
    }

    const fadeOut = function () {                                      //fadeOut
      // Stoppe vorherige Fade-Intervalle, falls vorhanden
      clearInterval(fadeInterval);

      fadeInterval = setInterval(() => {
        if (audio.volume > 0) {
          decreaseVolume();
        } else {
          // Stoppe das Intervall
          clearInterval(fadeInterval);
        }
      }, 100); // Reduziert die Lautstärke alle 200 Millisekunden
    }

    const fadeHold = function () {                                    //fadeHold
      clearInterval(fadeInterval);
    }

    const increaseVolume = function () {                               //increaseVolume
      audio.volume = Math.min(audio.volume + 0.02, 1);
    }

    const decreaseVolume = function () {                               //decreaseVolume
      audio.volume = Math.max(audio.volume - 0.02, 0);
    };

    const toggleSettings = function () {                               //toggleSettings
      addOutput('#')
      if (!isSettings) {
        isSettings = true;
        box.style.height = '300px';
        setContainer.classList.remove("hidden");
      } else {
        isSettings = false;
        box.style.height = '120px';
        setContainer.classList.add("hidden");
      }

    }


    //Input-Listener
    playButton.addEventListener("click", play);                      //play
    pauseButton.addEventListener("click", pause);                    //pause
    resetButton.addEventListener("click", reset);                    //reset

    muteButton.addEventListener("click", mute);                      //mute
    unmuteButton.addEventListener("click", unmute);                  //unmute            

    volPlusButton.addEventListener("click", increaseVolume);         //increaseVolume
    volMinusButton.addEventListener("click", decreaseVolume);        //decreaseVolume

    fadeInButton.addEventListener('click', fadeIn);                  //fadeIn
    fadeOutButton.addEventListener('click', fadeOut);                //fadeOut
    fadeHoldButton.addEventListener('click', fadeHold);              //fadeHold

    volContainer.addEventListener('click', setVolumeByClick);        //setVolumeByClick


    //Event-Listener
    audio.addEventListener("ended", reset)                           //reset

    audio.addEventListener('timeupdate', refreshTimeDisplays)        //refreshTimeDisplays
    audio.addEventListener('volumechange', refreshVolumeDisplays)    //refreshVolumeDisplays

    progressContainer.addEventListener('click', setTimer);           //setTimer

    setButton.addEventListener('click', toggleSettings);             //toggleSettings


    //Start
    audio.volume = startVolume;

    volBar.style.width = audio.volume * 100 + '%';
    volText.textContent = audio.volume * 100 + '%';

    timerText.textContent = formatTime(audio.currentTime);
    titleText.textContent = audio.src.split('/').pop().replaceAll('%20', ' ');

    //test output
    function aktuelleUhrzeit() {
      let jetzt = new Date();
      let stunden = jetzt.getHours();
      let minuten = jetzt.getMinutes();
      let sekunden = jetzt.getSeconds();

      // Führende Nullen hinzufügen
      if (stunden < 10) { stunden = '0' + stunden; }
      if (minuten < 10) { minuten = '0' + minuten; }
      if (sekunden < 10) { sekunden = '0' + sekunden; }

      let zeit = stunden + ':' + minuten + ':' + sekunden;
      time.innerText = zeit;
    }

    // Aktualisiere die Uhrzeit jede Sekunde
    setInterval(aktuelleUhrzeit, 1000);
    addOutput('output:');
