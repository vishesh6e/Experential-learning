// --- DOM Elements ---
const items = document.querySelectorAll('.item');
const slots = document.querySelectorAll('.slot');
const statusBar = document.getElementById('status-barText');

let draggedItem = null;

// --- Drag & Drop Initialization ---
items.forEach(item => {
    item.addEventListener('dragstart', (e) => {
        draggedItem = item;
        item.style.opacity = '0.4';
    });

    item.addEventListener('dragend', () => {
        item.style.opacity = '1';
    });
});

slots.forEach(slot => {
    // Allows the slot to receive a dropped item
    slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        slot.classList.add('drag-over');
    });

    // Visual feedback when leaving a slot area
    slot.addEventListener('dragleave', () => {
        slot.classList.remove('drag-over');
    });

    // Handling the "Drop" event
    slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        
        // Prevent double-dropping in the same slot
        if (slot.getAttribute('data-occupied') === "true") {
            alert("This station is already occupied!");
            return;
        }

        if (draggedItem) {
            const type = draggedItem.getAttribute('data-type');
            const color = draggedItem.getAttribute('data-color');
            
            // Create the beaker visual inside the workbench slot
            slot.innerHTML = `
                <div class="beaker active-beaker" data-type="${type}" data-color="${color}">
                    <div class="liquid" style="background:${color}; height: 60%"></div>
                </div>
                <p style="font-size:0.8rem; margin-top:10px">${type.toUpperCase()}</p>
            `;
            slot.setAttribute('data-occupied', "true");
            checkLabStatus();
        }
    });
});

/**
 * Updates the top status bar based on how many beakers are on the bench.
 */
function checkLabStatus() {
    const occupiedSlots = document.querySelectorAll('[data-occupied="true"]');
    if (occupiedSlots.length === 2) {
        statusBar.innerHTML = `Status: <span style="color:#2ecc71">Ready to Mix</span>`;
    } else {
        statusBar.innerHTML = `Status: <span style="color:var(--accent)">Add Second Reagent</span>`;
    }
}

/**
 * Triggered by the "MIX SOLUTIONS" button.
 * Logic: HCl (Acid) + NaOH (Base) -> NaCl (Salt) + H2O (Water)
 */
function mixChemicals() {
    const activeBeakers = document.querySelectorAll('.active-beaker');
    
    if (activeBeakers.length < 2) {
        alert("Please place two chemicals on the bench first!");
        return;
    }

    const types = Array.from(activeBeakers).map(b => b.getAttribute('data-type'));
    const liquids = document.querySelectorAll('.liquid');

    // Scenario A: Neutralization (Acid + Base)
    if (types.includes('acid') && types.includes('base')) {
        statusBar.innerHTML = `Status: <span style="color:#f1c40f">Neutralizing...</span>`;
        
        // Animate color change to purple/clear (representing salted water)
        liquids.forEach(liquid => {
            liquid.style.background = '#9b59b6'; 
            liquid.style.height = '85%'; // Simulate volume increase
        });

        setTimeout(() => {
            alert("Reaction Success!\nEquation: HCl + NaOH → NaCl + H₂O\nThe resulting solution is neutral salt water.");
            statusBar.innerHTML = `Status: <span style="color:#2ecc71">Stable (Neutral)</span>`;
        }, 1200);
    } 
    // Scenario B: Same chemicals mixed (No reaction)
    else {
        statusBar.innerHTML = `Status: <span style="color:#e74c3c">No Reaction</span>`;
        alert(`You mixed two ${types[0]}s. The concentration remains the same, but the volume increases.`);
        
        liquids.forEach(liquid => {
            liquid.style.height = '85%';
        });
    }
}
