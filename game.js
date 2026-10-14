// Main application entry point initializing modular subsystems
import { gameState } from "./js/state.js";
import { UIController } from "./js/ui.js";

document.addEventListener("DOMContentLoaded", () => {
    // Initialize UI Controller
    const ui = new UIController();

    // Initial render
    ui.renderHUD();
    ui.renderStage();
    ui.renderActionButtons();

    // Show Start / Main Menu Modal
    ui.showModal(ui.startModal);
});
