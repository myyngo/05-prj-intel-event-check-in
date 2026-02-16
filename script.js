// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track attendees
// Load counts from localStorage or start at 0
let count = parseInt(localStorage.getItem("attendeeCount")) || 0;
const maxCount = 50;

// Team counts
let teamCounts = {
  water: parseInt(localStorage.getItem("waterCount")) || 0,
  zero: parseInt(localStorage.getItem("zeroCount")) || 0,
  power: parseInt(localStorage.getItem("powerCount")) || 0,
};

// Attendee list
let attendeeList = JSON.parse(localStorage.getItem("attendeeList")) || [];

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.options[teamSelect.selectedIndex].text;

  console.log(name, team, teamName);

  // Increment count
  count++;
  // Update attendee count on page
  const attendeeCountSpan = document.getElementById("attendeeCount");
  attendeeCountSpan.textContent = count;
  console.log("total cheak-ins: ", count);
  localStorage.setItem("attendeeCount", count);

  // Update progress bar
  const percentage = Math.min((count / maxCount) * 100);
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = `${percentage}%`;
  console.log(`progress: ${percentage}%`);

  // Update team counter
  teamCounts[team]++;
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = teamCounts[team];
  localStorage.setItem(team + "Count", teamCounts[team]);

  // Show greeting message
  const greeting = document.getElementById("greeting");
  greeting.textContent = `🎉 Welcome ${name} from ${teamName}!`;
  console.log(greeting.textContent);

  // Add attendee to list
  attendeeList.push({ name: name, team: teamName });
  localStorage.setItem("attendeeList", JSON.stringify(attendeeList));
  renderAttendeeList();

  // Celebration feature
  if (count === maxCount) {
    // Find winning team
    let winningTeam = "";
    let max = 0;
    for (let t in teamCounts) {
      if (teamCounts[t] > max) {
        max = teamCounts[t];
        winningTeam = t;
      }
    }
    let winningTeamName = "";
    if (winningTeam === "water") {
      winningTeamName = "Team Water Wise";
    } else if (winningTeam === "zero") {
      winningTeamName = "Team Net Zero";
    } else if (winningTeam === "power") {
      winningTeamName = "Team Renewables";
    }
    greeting.textContent = `🏆 Goal reached! ${winningTeamName} wins!`;
  }
  form.reset();
  // Render attendee list
  function renderAttendeeList() {
    let container = document.getElementById("attendeeList");
    if (!container) {
      container = document.createElement("div");
      container.id = "attendeeList";
      container.style.marginTop = "1em";
      // Insert after team-stats
      const teamStats = document.querySelector(".team-stats");
      teamStats.parentNode.insertBefore(container, teamStats.nextSibling);
    }
    container.innerHTML = "<h4>Attendee List</h4>";
    if (attendeeList.length === 0) {
      container.innerHTML += "<p>No attendees yet.</p>";
      return;
    }
    const ul = document.createElement("ul");
    attendeeList.forEach(function (att) {
      const li = document.createElement("li");
      li.textContent = `${att.name} (${att.team})`;
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  // Initial render
  document.addEventListener("DOMContentLoaded", function () {
    // Set counts on page
    document.getElementById("attendeeCount").textContent = count;
    document.getElementById("waterCount").textContent = teamCounts.water;
    document.getElementById("zeroCount").textContent = teamCounts.zero;
    document.getElementById("powerCount").textContent = teamCounts.power;
    // Set progress bar
    const progressBar = document.getElementById("progressBar");
    const percentage = Math.min((count / maxCount) * 100);
    progressBar.style.width = `${percentage}%`;
    // Render attendee list
    renderAttendeeList();
  });
});
