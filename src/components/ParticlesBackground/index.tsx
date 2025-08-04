/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export const ParticlesBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = {
    fullScreen: {
      enable: true,
      zIndex: -1,
    },
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: ['#A855F7', '#9333EA', '#7E22CE'],
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: 0.4,
        random: false,
        anim: {
          enable: false,
        },
      },
      size: {
        value: 5,
        random: { enable: true, minimumValue: 3 },
        anim: {
          enable: false,
        },
      },
      move: {
        enable: true,
        speed: 1,
        direction: 'none',
        random: false,
        straight: false,
        outModes: {
          default: 'out',
        },
        attract: {
          enable: false,
        },
      },
      links: {
        enable: true,
        distance: 150,
        color: '#9333EA',
        opacity: 0.4,
        width: 1,
      },
    },
    detectRetina: true,
  };

  if (init) {
    return <Particles id="tsparticles" options={options as any} />;
  }

  return null;
};
