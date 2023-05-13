const monsters = {
    Emby: {
      position: {
        x: 280,
        y: 325
      },
      image: {
        src: '../assets/tiles/embySprite.png'
      },
      frames: {
        max: 4,
        hold: 90
      },
      animate: true,
      name: 'Emby',
      attacks: [attacks.Tackle, attacks.Ember],
      cry: new Howl({
        src: '../assets/music/quilava.mp3',
        html5: true,
        volume: 1
      })
    },
    Draggle: {
      position: {
        x: 800,
        y: 100
      },
      image: {
        src: '../assets/tiles/draggleSprite.png'
      },
      frames: {
        max: 4,
        hold: 90
      },
      animate: true,
      isEnemy: true,
      name: 'Draggle',
      attacks: [attacks.Tackle, attacks.Ember],
      cry: new Howl({
        src: '../assets/music/piplup.ogg',
        html5: true,
        volume: 1
      })
    }
  };
  