const SUPABASE_URL = "https://ngcfpttpxxcqlnoerdhk.supabase.co";
const SUPABASE_KEY = "sb_publishable_Cf2Q5FxtJwb_ur_ynq6vYQ_FD9wv-P4";

const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const candidates = [
  {
    id: 1,
    position: "President",
    name: "Mr. Percy Oppong Acheampong"
  },
  {
    id: 2,
    position: "Vice President",
    name: "Miss Elizabeth Owusu Serwaah"
  },
  {
    id: 3,
    position: "Secretary",
    name: "Mr. Tweneboah Koduah Samuel"
  },
  {
    id: 4,
    position: "Financial Secretary",
    name: "Stella Kwarteng"
  },
  {
    id: 5,
    position: "Welfare Officer",
    name: "Miss Agyeiwaa Sarpong"
  },
  {
    id: 6,
    position: "Organizer 1",
    name: "Mr. Emmanuel Akwasi Nyarko"
  },
  {
    id: 7,
    position: "Organizer 2",
    name: "Miss Hilda Serwaah Amoateng"
  }
];

const form = document.getElementById("voteForm");
const submitBtn = document.getElementById("submitBtn");
const message = document.getElementById("message");

// Generate a unique voter code for this device/browser
function getVoterCode() {
  let voterCode = localStorage.getItem("oamps19_voter_code");

  if (!voterCode) {
    voterCode =
      "OAMPS19-" +
      crypto.randomUUID();

    localStorage.setItem(
      "oamps19_voter_code",
      voterCode
    );
  }

  return voterCode;
}

// Display candidates
form.innerHTML = candidates.map(candidate => `
  <div class="candidate">

    <div class="position">
      ${candidate.position}
    </div>

    <div class="name">
      ${candidate.name}
    </div>

    <div class="choices">

      <div class="choice">
        <input
          type="radio"
          name="candidate-${candidate.id}"
          id="yes-${candidate.id}"
          value="YES"
        >
        <label for="yes-${candidate.id}">
          YES
        </label>
      </div>

      <div class="choice">
        <input
          type="radio"
          name="candidate-${candidate.id}"
          id="no-${candidate.id}"
          value="NO"
        >
        <label for="no-${candidate.id}">
          NO
        </label>
      </div>

    </div>

  </div>
`).join("");

// Check whether all 7 candidates have been answered
form.addEventListener("change", () => {

  const allAnswered = candidates.every(candidate => {
    return document.querySelector(
      `input[name="candidate-${candidate.id}"]:checked`
    );
  });

  submitBtn.disabled = !allAnswered;
});

// Submit vote
submitBtn.addEventListener("click", async () => {

  submitBtn.disabled = true;

  message.textContent = "Submitting your vote...";

  try {

    const voterCode = getVoterCode();

    // Collect YES/NO choices
    const votes = candidates.map(candidate => {

      const selected = document.querySelector(
        `input[name="candidate-${candidate.id}"]:checked`
      );

      return {
        candidate_id: candidate.id,
        voter_code: voterCode,
        vote: selected.value
      };

    });

    console.log("Votes being submitted:", votes);

    // Insert all 7 votes into Supabase
    const { data, error } = await client
      .from("votes")
      .insert(votes)
      .select();

    if (error) {
      throw error;
    }

    console.log("Vote successfully submitted:", data);

    // Success message
    form.innerHTML = "";

    message.innerHTML = `
      <strong>✅ Vote Submitted Successfully!</strong>
      <br><br>
      Thank you for voting in the OAMPS19 election.
    `;

    submitBtn.style.display = "none";

  } catch (error) {

    console.error("VOTING ERROR:", error);

    message.innerHTML = `
      ❌ <strong>Your vote could not be submitted.</strong>
      <br><br>
      ${error.message || "Unknown error"}
    `;

    submitBtn.disabled = false;
  }

});
