

export class InputManager {

    static #instance: InputManager;
    public static get instance(): InputManager {
        if (!InputManager.#instance) {
            InputManager.#instance = new InputManager();
        }

        return InputManager.#instance;
    }
    private constructor() {

    }
}