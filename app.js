const SUPABASE_URL = "https://ngcfpttpxxcqlnoerdhk.supabase.co";
const SUPABASE_KEY = "sb_publishable_Cf2Q5FxtJwb_ur_ynq6vYQ_FD9wv-P4";

const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const candidates = [
  { id: 1, position: "President", name: "Mr. Percy Oppong Acheampong" },
  { id: 2, position: "Vice President", name: "Miss Elizabeth Owusu Serwaah" },
  { id: 3, position: "Secretary", name: "Mr. Tweneboah Koduah Samuel" },
  { id: 4, position: "Financial Secretary", name: "Stella Kwarteng" },
  { id: 5, position: "Welfare Officer", name: "Miss Agyeiwaa Sarpong" },
  { id: 6, position: "Organizer 1", name: "Mr. Emmanuel Akwasi Nyarko" },
  { id: 7, position: "Organizer 2", name: "Miss Hilda Serwaah Amoateng" }
];

const form = document.getElementById("voteForm");
const submitBtn = document.getElementById("submitBtn");
const message = document.getElementById("message");

// Display all candidates
form.innerHTML = candidates.map(candidate => `
  <div class="candidate">
    <div class="position">${candidate.position}</div>
    <div class="name">${candidate.name}</div>

    <div class="choices">
      <div class="choice">
        <input
          type="radio"
          name="candidate-${candidate.id}"
          id="yes-${candidate.id}"
          value="YES"
        >
        <label for="yes-${candidate.id}">YES</label>
      </div>

      <div class="choice">
        <input
          type="radio"
          name="candidate-${candidate.id}"
          id="no-${candidate.id}"
          value="NO"
        >
        <label for="no-${candidate.id}">NO</label>
      </div>
    </div>
  </div>
`).join("");

// Enable Submit only when all 7 have an answer
form.addEventListener("change", () => {
  const complete = candidates.every(candidate =>
    document.querySelector(
      `input[name="candidate-${candidate.id}"]:checked`
    )
  );

  submitBtn.disabled = !complete;
});

// Submit votes
submitBtn.addEventListener("click", async () => {
  submitBtn.disabled = true;
  message.textContent = "Submitting your vote...";

  try {
    // Create anonymous Supabase user
    const { data: authData, error: authError } =
      await client.auth.signInAnonymously();

    if (authError) throw authError;

    const voterId = authData.user.id;

    // Create one vote for each candidate
    const votes = candidates.map(candidate => {
      const selected = document.querySelector(
        `input[name="candidate-${candidate.id}"]:checked`
      ).value;

      return {
        candidate_id: candidate.id,
        voter_id: voterId,
        voter_code: voterId,
        vote: selected
      };
    });

    // Send votes to Supabase
    const { error } = await client
      .from("votes")
      .insert(votes);

    if (error) throw error;

    form.innerHTML = "";

    message.textContent =
      "✅ Your OAMPS19 vote has been submitted successfully.";

    submitBtn.style.display = "none";

  } catch (error) {
    console.error(error);

    message.textContent =
      "❌ Your vote could not be submitted. Please try again.";

    submitBtn.disabled = false;
  }
});
