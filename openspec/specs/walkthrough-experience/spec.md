# walkthrough-experience Specification

## Purpose
Define the shipped finite HyperFrames explanation, truthful recorded examples, deterministic accessible playback, phone-readable captions and relative return to the working playground. The library repository owns engine and adapter behavior.
## Requirements
### Requirement: Genuine deterministic HyperFrames composition
The walkthrough MUST expose a finite 30-second HyperFrames composition with matching root and paused-timeline identifiers, actual local GSAP assets and a deterministic absolute-time seek adapter independent of the player shell's clock.

#### Scenario: Initial composition is finite and paused
- **WHEN** the module loads
- **THEN** the registered timeline is paused with duration 30 seconds
- **AND** its registration ID matches the timed composition root
- **AND** no external browser asset or generation model is required

### Requirement: Honest recorded evidence
The walkthrough MUST label its Nimbus examples as recorded evidence with the recorded engine version and derive displayed query, score, floor and source facts from the saved recording rather than fabricated values.

#### Scenario: Refund and abstention explain different outcomes
- **WHEN** the recorded examples are shown
- **THEN** the refund example displays its recorded source and score 3.8605 above floor 0.5
- **AND** the France query has no working set in the recorded corpus
- **AND** source extracts are not described as generated answers

#### Scenario: A lexical false positive is explained
- **WHEN** the delivery question returns Pausing Your Subscription at score 2.9429
- **THEN** the module identifies the wrong match despite grounded=true
- **AND** it explains that passing the lexical floor does not verify that a source answers the question

### Requirement: On-demand controlled playback
The player MUST remain paused and silent on arrival and provide Play/Pause, Replay, a labeled seek slider and chapter navigation that operate the actual composition.

#### Scenario: Visitor controls playback
- **WHEN** the visitor plays, pauses and replays
- **THEN** position progresses only while playing and ends at the finite duration
- **AND** replay restarts from the beginning

#### Scenario: Background and reload do not silently continue playback
- **WHEN** a playing tab becomes hidden or the page reloads
- **THEN** background playback pauses and a reload returns to the paused opening

### Requirement: Seek consistency and bounds
The composition MUST support forward and backward seeks through every chapter, clamp finite out-of-range times and reject nonfinite times.

#### Scenario: Scrub or chapter navigation
- **WHEN** a visitor scrubs or selects a chapter
- **THEN** playback pauses on the selected readable state
- **AND** visible chapter, slider, time readout and current-chapter indication agree

#### Scenario: Invalid seek input
- **WHEN** a caller seeks before zero or past duration
- **THEN** the actual time is clamped to the valid interval
- **AND** nonfinite input raises an error rather than corrupting timeline state

### Requirement: Accessible motion and phone interpretation
The player MUST support keyboard controls, reduced-motion preference with an explicit override, non-overflowing phone layout, at least 44px primary touch targets, a visible chapter-synced caption of at least 16px and a full text alternative.

#### Scenario: Important meaning remains readable on phones
- **WHEN** a phone visitor selects the wrong-match chapter
- **THEN** its explanation is visible outside the scaled animation without opening the transcript
- **AND** the chapter grid, playback controls and caption do not overlap or widen the page

#### Scenario: Keyboard and reduced motion
- **WHEN** a keyboard visitor selects a chapter or scrubs using arrow/Home/End keys
- **THEN** the actual timeline and current caption update
- **AND** reduced motion follows the system preference unless explicitly changed by the visitor

### Requirement: Coherent return navigation and safe failure
The player MUST expose real relative links back to the working playground and explain composition initialization failure rather than leaving apparently working playback controls enabled.

#### Scenario: The seek adapter is unavailable
- **WHEN** the real composition fails to initialize
- **THEN** an explanatory status is shown, unavailable playback controls are disabled and the text alternative remains accessible

#### Scenario: The visitor returns to the tool
- **WHEN** the visitor activates Try the live playground
- **THEN** the relative parent destination opens the working playground instead of a dead control

### Requirement: Reproducible evidence and validation
The walkthrough MUST retain its evidence JSON, a reproducible generator, package pins and playback regression tests; validation records MUST distinguish structural warnings, sampled execution and actual hosted readback.

#### Scenario: Verification is reported without inflation
- **WHEN** release evidence is recorded
- **THEN** real HyperFrames sample/contrast outcomes and browser-test results are reported separately from warnings
- **AND** a successful local check is not reported as a deployment or MP4 render
