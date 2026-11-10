document.addEventListener("DOMContentLoaded", () => {

    // DATE
    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    document.getElementById("currentDate").textContent = today;


    // MOBILE MENU
    const menuBtn = document.getElementById("menuBtn");
    const navMenu = document.getElementById("navMenu");

    menuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("open");
    });

    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
        });
    });


    // DARK MODE
    const themeToggle = document.getElementById("themeToggle");

    if (localStorage.getItem("pranaTheme") === "dark") {
        document.body.classList.add("dark");
        themeToggle.textContent = "☀";
    }

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        const dark = document.body.classList.contains("dark");

        themeToggle.textContent = dark ? "☀" : "☾";

        localStorage.setItem("pranaTheme", dark ? "dark" : "light");
    });


    // DAILY DATA
    const dateKey = new Date().toLocaleDateString("en-CA");

    function loadData() {

        const saved = JSON.parse(
            localStorage.getItem("pranaData") || "{}"
        );

        if (saved.date !== dateKey) {
            return {
                date: dateKey,
                water: 0,
                minutes: 0,
                habits: [false, false, false]
            };
        }

        return {
            date: dateKey,
            water: saved.water || 0,
            minutes: saved.minutes || 0,
            habits: Array.isArray(saved.habits)
                ? saved.habits
                : [false, false, false]
        };
    }

    let data = loadData();

    function saveData() {
        localStorage.setItem("pranaData", JSON.stringify(data));
    }


    // UPDATE DASHBOARD
    function updateDashboard() {

        const completed = data.habits.filter(Boolean).length;

        document.getElementById("waterValue").textContent =
            `${data.water} / 8`;

        document.getElementById("workoutValue").textContent =
            `${data.minutes} min`;

        document.getElementById("habitValue").textContent =
            `${completed} / 3`;

        document.getElementById("waterProgress").style.width =
            Math.min(data.water / 8 * 100, 100) + "%";

        document.getElementById("workoutProgress").style.width =
            Math.min(data.minutes / 30 * 100, 100) + "%";

        document.getElementById("habitProgress").style.width =
            completed / 3 * 100 + "%";

        document.querySelectorAll(".habit").forEach((checkbox, index) => {
            checkbox.checked = data.habits[index];
        });
    }

    document.getElementById("addWater").addEventListener("click", () => {

        if (data.water < 8) {
            data.water++;
            saveData();
            updateDashboard();
        } else {
            alert("Your optional daily water tracking goal is complete!");
        }
    });

    document.querySelectorAll(".habit").forEach((checkbox, index) => {

        checkbox.addEventListener("change", () => {

            data.habits[index] = checkbox.checked;

            saveData();
            updateDashboard();
        });

    });


    // WORKOUT TIMER
    let seconds = 300;
    let timer = null;
    let running = false;

    const timerDisplay = document.getElementById("timerDisplay");

    function showTime() {

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        timerDisplay.textContent =
            String(mins).padStart(2, "0") + ":" +
            String(secs).padStart(2, "0");
    }

    function startTimer() {

        if (running) return;

        if (seconds === 0) seconds = 300;

        running = true;

        timer = setInterval(() => {

            if (seconds > 0) {
                seconds--;
                showTime();
            } else {

                clearInterval(timer);
                running = false;

                data.minutes += 5;
                saveData();
                updateDashboard();

                alert("Great work! Your session is complete 🌿");
            }

        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timer);
        running = false;
    }

    function resetTimer() {
        pauseTimer();
        seconds = 300;
        showTime();
    }

    document.getElementById("startTimer")
        .addEventListener("click", startTimer);

    document.getElementById("pauseTimer")
        .addEventListener("click", pauseTimer);

    document.getElementById("resetTimer")
        .addEventListener("click", resetTimer);

    showTime();


    // WORKOUT DETAILS
    const workouts = {

        surya: {
            title: "Surya Namaskar",
            description: "A traditional sequence of yoga postures performed in a flowing order. Coordinate gentle movements with comfortable breathing.",
            tip: "Begin with 2–3 comfortable rounds. Avoid forcing stretches."
        },

        tree: {
            title: "Vrikshasana",
            description: "Tree Pose is a standing balance posture that encourages body awareness and stability.",
            tip: "Use a wall for support. Place your foot on your calf or thigh, never directly on your knee."
        },

        dand: {
            title: "Dand Exercise",
            description: "Dand is a traditional Indian bodyweight movement with similarities to a push-up.",
            tip: "Learn proper form first and use an easier variation if needed."
        },

        baithak: {
            title: "Baithak",
            description: "A traditional Indian squat movement that works the lower body.",
            tip: "Start with shallow, controlled movements. Stop if you feel pain."
        }

    };

    const modal = document.getElementById("workoutModal");

    document.querySelectorAll(".learn-btn").forEach(button => {

        button.addEventListener("click", () => {

            const workout = workouts[button.dataset.workout];

            document.getElementById("modalTitle").textContent =
                workout.title;

            document.getElementById("modalDescription").textContent =
                workout.description;

            document.getElementById("modalTip").textContent =
                workout.tip;

            modal.classList.add("show");
        });

    });

    document.getElementById("closeModal").addEventListener("click", () => {
        modal.classList.remove("show");
    });

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.classList.remove("show");
        }
    });

    document.getElementById("modalTimer").addEventListener("click", () => {
        modal.classList.remove("show");
        resetTimer();
        startTimer();
    });


    // BMI CALCULATOR
    document.getElementById("calculateBMI").addEventListener("click", () => {

        const weight = Number(document.getElementById("weight").value);
        const height = Number(document.getElementById("height").value);

        const result = document.getElementById("bmiResult");

        if (
            !Number.isFinite(weight) ||
            !Number.isFinite(height) ||
            weight <= 0 ||
            height <= 0 ||
            height > 300 ||
            weight > 500
        ) {
            result.textContent = "Please enter valid height and weight.";
            return;
        }

        const bmi = weight / Math.pow(height / 100, 2);

        let category;

        if (bmi < 18.5) {
            category = "Below standard adult BMI range";
        } else if (bmi < 25) {
            category = "Within standard adult BMI range";
        } else if (bmi < 30) {
            category = "Above standard adult BMI range";
        } else {
            category = "Higher adult BMI range";
        }

        result.textContent =
            `Your BMI: ${bmi.toFixed(1)} | ${category}`;

    });


    // DAILY WELLNESS TIPS
    const tips = [
        "Health is the greatest wealth.",
        "Small steps create lasting habits.",
        "Move your body and nourish your mind.",
        "Balance is the foundation of wellness.",
        "Eat mindfully and enjoy natural foods.",
        "Take time to relax and recharge.",
        "Consistency matters more than perfection."
    ];

    document.getElementById("newTip").addEventListener("click", () => {

        const random = Math.floor(Math.random() * tips.length);

        document.getElementById("tipText").textContent = tips[random];

    });


    // INITIALIZE
    updateDashboard();

});
