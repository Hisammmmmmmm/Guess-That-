import { useEffect, useState, useRef, useCallback } from 'react';

export interface GamepadState {
  isConnected: boolean;
  gamepadId: string | null;
  isXbox: boolean;
}

export type GamepadAction = 
  | 'UP'
  | 'DOWN'
  | 'LEFT'
  | 'RIGHT'
  | 'A' // Confirm / Option 1
  | 'B' // Back / Cancel / Option 2
  | 'X' // Action / Option 3 / Toggle Private-Public
  | 'Y' // Action / Option 4 / Quick Library
  | 'LB' // Previous tab
  | 'RB' // Next tab
  | 'START' // Menu / Settings
  | 'BACK'; // View / Stats

interface UseGamepadOptions {
  onAction?: (action: GamepadAction) => void;
  enableSyntheticKeyboardEvents?: boolean;
}

export const useGamepad = (options: UseGamepadOptions = {}) => {
  const { onAction, enableSyntheticKeyboardEvents = true } = options;
  const [gamepadState, setGamepadState] = useState<GamepadState>({
    isConnected: false,
    gamepadId: null,
    isXbox: false,
  });

  const lastActionTimeRef = useRef<{ [key in GamepadAction]?: number }>({});
  const rafIdRef = useRef<number | null>(null);

  // Cooldowns (ms)
  const INITIAL_DELAY = 220;
  const REPEAT_DELAY = 150;

  const triggerAction = useCallback((action: GamepadAction) => {
    // Fire callback
    onAction?.(action);

    // Fire window CustomEvent
    window.dispatchEvent(
      new CustomEvent('gamepad-action', {
        detail: { action },
      })
    );

    // If synthetic keyboard events are enabled, dispatch appropriate keydown/keyup
    if (enableSyntheticKeyboardEvents) {
      let key = '';
      let code = '';

      switch (action) {
        case 'UP':
          key = 'ArrowUp';
          code = 'ArrowUp';
          break;
        case 'DOWN':
          key = 'ArrowDown';
          code = 'ArrowDown';
          break;
        case 'LEFT':
          key = 'ArrowLeft';
          code = 'ArrowLeft';
          break;
        case 'RIGHT':
          key = 'ArrowRight';
          code = 'ArrowRight';
          break;
        case 'A':
          key = 'Enter';
          code = 'Enter';
          break;
        case 'B':
          key = 'Escape';
          code = 'Escape';
          break;
        case 'X':
          key = 'x';
          code = 'KeyX';
          break;
        case 'Y':
          key = 'y';
          code = 'KeyY';
          break;
        case 'LB':
          key = 'PageUp';
          code = 'PageUp';
          break;
        case 'RB':
          key = 'PageDown';
          code = 'PageDown';
          break;
        case 'START':
          key = 'm';
          code = 'KeyM';
          break;
        case 'BACK':
          key = 'v';
          code = 'KeyV';
          break;
      }

      if (key) {
        const keyEventInit: KeyboardEventInit = {
          key,
          code,
          bubbles: true,
          cancelable: true,
        };

        const activeElem = document.activeElement;
        const target = activeElem && activeElem !== document.body ? activeElem : window;

        target.dispatchEvent(new KeyboardEvent('keydown', keyEventInit));
        setTimeout(() => {
          target.dispatchEvent(new KeyboardEvent('keyup', keyEventInit));
        }, 30);
      }
    }
  }, [onAction, enableSyntheticKeyboardEvents]);

  // Gamepad polling loop
  useEffect(() => {
    let isRunning = true;

    const checkGamepad = () => {
      if (!navigator.getGamepads) return;

      const gamepads = navigator.getGamepads();
      let activeGamepad: Gamepad | null = null;

      for (let i = 0; i < gamepads.length; i++) {
        const gp = gamepads[i];
        if (gp && gp.connected) {
          activeGamepad = gp;
          break;
        }
      }

      if (activeGamepad) {
        const now = Date.now();
        const idLower = activeGamepad.id.toLowerCase();
        const isXboxController =
          idLower.includes('xbox') ||
          idLower.includes('xinput') ||
          idLower.includes('045e') ||
          idLower.includes('standard gamepad');

        setGamepadState(prev => {
          if (!prev.isConnected || prev.gamepadId !== activeGamepad?.id) {
            return {
              isConnected: true,
              gamepadId: activeGamepad?.id || 'Gamepad',
              isXbox: isXboxController,
            };
          }
          return prev;
        });

        // Check Stick & D-Pad
        const STICK_DEADZONE = 0.5;
        const axisX = activeGamepad.axes[0] || 0;
        const axisY = activeGamepad.axes[1] || 0;

        const bUp = activeGamepad.buttons[12]?.pressed || axisY < -STICK_DEADZONE;
        const bDown = activeGamepad.buttons[13]?.pressed || axisY > STICK_DEADZONE;
        const bLeft = activeGamepad.buttons[14]?.pressed || axisX < -STICK_DEADZONE;
        const bRight = activeGamepad.buttons[15]?.pressed || axisX > STICK_DEADZONE;

        // Action Buttons (Standard Mapping)
        const bA = activeGamepad.buttons[0]?.pressed; // A (Bottom button)
        const bB = activeGamepad.buttons[1]?.pressed; // B (Right button)
        const bX = activeGamepad.buttons[2]?.pressed; // X (Left button)
        const bY = activeGamepad.buttons[3]?.pressed; // Y (Top button)

        // Bumpers & Triggers
        const bLB = activeGamepad.buttons[4]?.pressed;
        const bRB = activeGamepad.buttons[5]?.pressed;

        // Special Buttons
        const bBack = activeGamepad.buttons[8]?.pressed;
        const bStart = activeGamepad.buttons[9]?.pressed;

        const checkButtonState = (pressed: boolean | undefined, action: GamepadAction) => {
          if (pressed) {
            const lastTime = lastActionTimeRef.current[action] || 0;
            if (now - lastTime > INITIAL_DELAY) {
              lastActionTimeRef.current[action] = now;
              triggerAction(action);
            }
          } else {
            delete lastActionTimeRef.current[action];
          }
        };

        checkButtonState(bUp, 'UP');
        checkButtonState(bDown, 'DOWN');
        checkButtonState(bLeft, 'LEFT');
        checkButtonState(bRight, 'RIGHT');
        checkButtonState(bA, 'A');
        checkButtonState(bB, 'B');
        checkButtonState(bX, 'X');
        checkButtonState(bY, 'Y');
        checkButtonState(bLB, 'LB');
        checkButtonState(bRB, 'RB');
        checkButtonState(bStart, 'START');
        checkButtonState(bBack, 'BACK');
      } else {
        setGamepadState(prev => {
          if (prev.isConnected) {
            return {
              isConnected: false,
              gamepadId: null,
              isXbox: false,
            };
          }
          return prev;
        });
      }

      if (isRunning) {
        rafIdRef.current = requestAnimationFrame(checkGamepad);
      }
    };

    const handleGamepadConnected = (e: GamepadEvent) => {
      const idLower = e.gamepad.id.toLowerCase();
      setGamepadState({
        isConnected: true,
        gamepadId: e.gamepad.id,
        isXbox: idLower.includes('xbox') || idLower.includes('xinput') || idLower.includes('045e'),
      });
    };

    const handleGamepadDisconnected = () => {
      setGamepadState({
        isConnected: false,
        gamepadId: null,
        isXbox: false,
      });
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    rafIdRef.current = requestAnimationFrame(checkGamepad);

    return () => {
      isRunning = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, [triggerAction]);

  return gamepadState;
};
