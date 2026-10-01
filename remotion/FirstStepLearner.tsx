import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import {GlassPanel} from './effects/GlassPanel';
import {TypewriterText} from './effects/TypewriterText';
import {ProgressLine} from './effects/ProgressLine';
import {CountUp} from './effects/CountUp';
import {ParticleTrail} from './effects/ParticleTrail';
import {CardFlip} from './effects/CardFlip';
import {DepthBlur} from './effects/DepthBlur';
import {MagneticSnap} from './effects/MagneticSnap';
import {GridPulse} from './effects/GridPulse';
import {SplitWipe} from './effects/SplitWipe';
import {MorphShape} from './effects/MorphShape';

const BG = '#0A0A0A';
const VIOLET = '#7B2FF7';
const WHITE = '#F7F4FF';
const MUTED = '#A99FBA';

const SectionLabel: React.FC<{
  number: string;
  title: string;
}> = ({number, title}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 18,
    }}
  >
    <div
      style={{
        fontSize: 22,
        color: VIOLET,
        fontWeight: 800,
      }}
    >
      {number}
    </div>

    <div
      style={{
        fontSize: 18,
        letterSpacing: 3,
        color: MUTED,
        textTransform: 'uppercase',
      }}
    >
      {title}
    </div>
  </div>
);

export const FirstStepLearner: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const intro = spring({
    frame,
    fps,
    config: {
      damping: 16,
      stiffness: 90,
      mass: 0.8,
    },
  });

  const vignette = interpolate(
    frame,
    [0, 45, 1080],
    [0.1, 0.35, 0.22],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        color: WHITE,
        fontFamily:
          'Arial, Helvetica, sans-serif',
        overflow: 'hidden',
      }}
    >
      <GridPulse
        opacity={0.08}
        spacing={90}
      />

      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(123,47,247,0.18), rgba(10,10,10,0) 48%)',
          opacity: 0.85 * intro,
        }}
      />

      <AbsoluteFill
        style={{
          boxShadow:
            `inset 0 0 220px rgba(0,0,0,${vignette})`,
          pointerEvents: 'none',
        }}
      />

      {/* EFFECT 1 — Glassmorphism */}

      <Sequence
        from={0}
        durationInFrames={90}
      >
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GlassPanel
            width={1050}
            height={390}
          >
            <div
              style={{
                padding: 54,
              }}
            >
              <SectionLabel
                number="01"
                title="Glass UI"
              />

              <div
                style={{
                  marginTop: 38,
                  fontSize: 58,
                  fontWeight: 800,
                }}
              >
                Transparent interface.
              </div>

              <div
                style={{
                  marginTop: 16,
                  fontSize: 25,
                  color: MUTED,
                }}
              >
                Panels fade and scale into focus.
              </div>
            </div>
          </GlassPanel>
        </AbsoluteFill>
      </Sequence>

      {/* EFFECT 2 — Typewriter */}

      <Sequence
        from={90}
        durationInFrames={90}
      >
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DepthBlur startFrame={0}>
            <SectionLabel
              number="02"
              title="Typewriter"
            />

            <div
              style={{
                marginTop: 34,
                fontSize: 64,
                fontWeight: 800,
              }}
            >
              <TypewriterText
                text="AI ko kaam sonp do."
                framesPerCharacter={3}
              />
            </div>
          </DepthBlur>
        </AbsoluteFill>
      </Sequence>

      {/* EFFECT 3 — Progress line */}

      <Sequence
        from={180}
        durationInFrames={90}
      >
        <AbsoluteFill
          style={{
            padding: '150px 180px',
          }}
        >
          <SectionLabel
            number="03"
            title="Progress"
          />

          <div
            style={{
              marginTop: 55,
            }}
          >
            <ProgressLine
              width={1560}
              startFrame={0}
            />
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              color: MUTED,
            }}
          >
            A new section starts with a glowing violet line.
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* EFFECT 4 — Count up */}

      <Sequence
        from={270}
        durationInFrames={90}
      >
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{textAlign: 'center'}}>
            <SectionLabel
              number="04"
              title="Count Up"
            />

            <div
              style={{
                marginTop: 28,
                fontSize: 150,
                fontWeight: 900,
                color: VIOLET,
              }}
            >
              <CountUp
                target={100}
                suffix="%"
              />
            </div>

            <div
              style={{
                fontSize: 26,
                color: MUTED,
              }}
            >
              animated number
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* EFFECT 5 — Particle trail */}

      <Sequence
        from={360}
        durationInFrames={90}
      >
        <AbsoluteFill>
          <div
            style={{
              position: 'absolute',
              left: 180,
              top: 160,
            }}
          >
            <SectionLabel
              number="05"
              title="Particle Trail"
            />
          </div>

          <ParticleTrail startFrame={0} />

          <div
            style={{
              position: 'absolute',
              left: 1500,
              top: 505,
              width: 70,
              height: 70,
              borderRadius: 18,
              background: VIOLET,
              boxShadow:
                `0 0 50px ${VIOLET}`,
              transform:
                'translate(-50%, -50%) rotate(45deg)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              left: 1500,
              top: 625,
              fontSize: 26,
              color: MUTED,
              transform: 'translateX(-50%)',
            }}
          >
            Moving element + trail
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* EFFECT 6 — 3D card flip */}

      <Sequence
        from={450}
        durationInFrames={90}
      >
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CardFlip
            startFrame={0}
            front={
              <div
                style={{
                  fontSize: 58,
                  fontWeight: 800,
                }}
              >
                BEFORE
              </div>
            }
            back={
              <div
                style={{
                  fontSize: 58,
                  fontWeight: 800,
                  color: VIOLET,
                }}
              >
                AFTER
              </div>
            }
          />

          <div
            style={{
              position: 'absolute',
              top: 130,
            }}
          >
            <SectionLabel
              number="06"
              title="3D Card Flip"
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* EFFECT 7 — Depth of field */}

      <Sequence
        from={540}
        durationInFrames={90}
      >
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.25,
            }}
          >
            <GridPulse
              opacity={0.2}
              spacing={55}
            />
          </div>

          <DepthBlur startFrame={0}>
            <div style={{textAlign: 'center'}}>
              <SectionLabel
                number="07"
                title="Depth of Field"
              />

              <div
                style={{
                  marginTop: 35,
                  fontSize: 70,
                  fontWeight: 900,
                }}
              >
                FOCUS
              </div>

              <div
                style={{
                  marginTop: 15,
                  color: MUTED,
                  fontSize: 26,
                }}
              >
                Background softens. Foreground sharpens.
              </div>
            </div>
          </DepthBlur>
        </AbsoluteFill>
      </Sequence>

      {/* EFFECT 8 — Magnetic snap */}

      <Sequence
        from={630}
        durationInFrames={90}
      >
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{textAlign: 'center'}}>
            <SectionLabel
              number="08"
              title="Magnetic Snap"
            />

            <MagneticSnap startFrame={0}>
              <div
                style={{
                  marginTop: 35,
                  padding:
                    '28px 58px',
                  borderRadius: 999,
                  background: VIOLET,
                  color: '#FFFFFF',
                  fontSize: 58,
                  fontWeight: 900,
                  boxShadow:
                    '0 0 60px rgba(123,47,247,0.5)',
                }}
              >
                SNAP
              </div>
            </MagneticSnap>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* EFFECT 9 — Pulsing grid */}

      <Sequence
        from={720}
        durationInFrames={90}
      >
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GridPulse
            opacity={0.2}
            spacing={70}
          />

          <div
            style={{
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <SectionLabel
              number="09"
              title="Circuit Grid"
            />

            <div
              style={{
                marginTop: 30,
                fontSize: 62,
                fontWeight: 800,
              }}
            >
              SIGNAL PULSE
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* EFFECT 10 — Split wipe */}

      <Sequence
        from={810}
        durationInFrames={90}
      >
        <SplitWipe startFrame={0}>
          <AbsoluteFill
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{textAlign: 'center'}}>
              <SectionLabel
                number="10"
                title="Split Wipe"
              />

              <div
                style={{
                  marginTop: 30,
                  fontSize: 70,
                  fontWeight: 900,
                }}
              >
                NEXT SECTION
              </div>
            </div>
          </AbsoluteFill>
        </SplitWipe>
      </Sequence>

      {/* EFFECT 11 — Morphing shape */}

      <Sequence
        from={900}
        durationInFrames={90}
      >
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{textAlign: 'center'}}>
            <SectionLabel
              number="11"
              title="Morphing Shape"
            />

            <div
              style={{
                marginTop: 45,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <MorphShape startFrame={0} />
            </div>

            <div
              style={{
                marginTop: 35,
                fontSize: 26,
                color: MUTED,
              }}
            >
              Abstract chat shape morphing into a brain-like form.
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Final brand card */}

      <Sequence
        from={990}
        durationInFrames={90}
      >
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MagneticSnap startFrame={0}>
            <div style={{textAlign: 'center'}}>
              <div
                style={{
                  fontSize: 26,
                  letterSpacing: 6,
                  color: VIOLET,
                  fontWeight: 800,
                }}
              >
                FIRST STEP LEARNER
              </div>

              <div
                style={{
                  marginTop: 22,
                  fontSize: 68,
                  fontWeight: 900,
                }}
              >
                LEARN AI • BUILD SKILLS • GROW FUTURE
              </div>
            </div>
          </MagneticSnap>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
